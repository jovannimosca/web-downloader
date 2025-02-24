import requests, logging, threading, queue, psycopg2
from dotenv import load_dotenv
from os import environ as env
from datetime import datetime
from pathlib import Path
from models.file import FileResponse, File, StatusResponse
from typing import Optional

load_dotenv()

class Downloader:
   def __init__(self, downloads_dir: str, num_workers: int = 2):
      self._logger = logging.getLogger('uvicorn.error')
      self.dir: Path = Path(downloads_dir)
      # Connect to database:
      self._db = psycopg2.connect(
         dbname=env.get("DATABASE_NAME", "postgres"),
         user=env.get("DATABASE_USER", "postgres"),
         password=env.get("DATABASE_PASSWORD", ""),
         host=env.get("DATABASE_HOST", "localhost"),
      )
      self._init_database()
      # Initialize job queueing:
      self._q = queue.Queue()
      self._workers = []
      for _ in range(num_workers):
         p = threading.Thread(target=self._worker, daemon=True)
         p.start()
         self._workers.append(p)
         
   def _init_database(self) -> None:
      check_query: str = "SELECT * FROM downloads LIMIT 1;"
      status_type_query: str = "CREATE TYPE download_status AS ENUM ('SUCCESS', 'FAILURE');"
      table_query: str = """
      CREATE TABLE IF NOT EXISTS downloads (
         id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
         filename VARCHAR(50) NOT NULL,
         url VARCHAR(255) NOT NULL,
         status download_status NOT NULL DEFAULT 'SUCCESS',
         seconds_elapsed INTERVAL NOT NULL,
         timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      """
      with self._db as conn:
         with conn.cursor() as cursor:
            try:
               cursor.execute(check_query)
            except psycopg2.errors.UndefinedTable:
               self._logger.info("Database not initialized, creating tables")
               cursor.execute(status_type_query)
               cursor.execute(table_query)
               self._logger.info("Database initialized")
            else:
               self._logger.info("Database already initialized; proceeding")
      
   def _write_to_database(self, file: File) -> None:
      query: str = "INSERT INTO downloads (filename, url, status, seconds_elapsed, timestamp) VALUES (%s, %s, %s, %s, %s);"
      with self._db as conn:
         with conn.cursor() as cursor:
            cursor.execute(query, (file.filename, file.url, file.status, file.seconds_elapsed, file.timestamp))
      self._logger.info(f"File {file.filename} written to database")
      
   def _get_from_database(self, page_number: int, page_size: int) -> StatusResponse:
      """Get status of downloads from database

      Parameters
      ----------
      page_number : int
          zero-indexed page number
      page_size : int
          number of items per page

      Returns
      -------
      list[File]
          the list of files on the page
      """
      data: list[File] = []
      numRows: int = 0
      query: str = "SELECT * FROM downloads ORDER BY timestamp DESC LIMIT %s OFFSET %s;"
      with self._db as conn:
         with conn.cursor() as cursor:
            cursor.execute(query, (page_size, page_size * page_number))
            data = [File.model_validate(dict(zip(["id", "filename", "url", "status", "seconds_elapsed", "timestamp"], row))) for row in cursor.fetchall()]
         with conn.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM downloads;")
            numRows = cursor.fetchone()[0]
      return StatusResponse(page=page_number, pageSize=page_size, rowCount=numRows, data=data)
            
   def get(self, url: str, filename: Optional[str] = None) -> FileResponse:
      # Initial validation to prevent errors post-response:
      if not url.startswith("http://") and not url.startswith("https://"):
         raise ValueError("URL must start include scheme, e.g. 'https://'")
      # Try to determine file name dynamically:
      if filename is None:
         filename = url.split('/')[-1]
      self._logger.info(f"Downloading file '{filename}' from {url}")
      self._q.put({"url": url, "filename": filename})
      return FileResponse(filename=filename)
   
   def status(self, page_number: int, page_size: int) -> StatusResponse:
      # Validation:
      if page_number < 0 or page_size < 1:
         raise ValueError("Page number and page size must be positive integers")
      self._logger.info(f"Retrieving page {page_number} of size {page_size}")
      return self._get_from_database(page_number, page_size)
      
   def close(self):
      self._logger.info("Closing downloader")
      # Close threads:
      for _ in range(len(self._workers)):
         self._q.put(None)
      self._q.join()
      # Close database:
      self._db.close()
      self._logger.info("Downloader closed")
      
   def _download(self, url: str, filename: str) -> File:
      try:
         # Get data:
         self._logger.info(f"Streaming data for file {filename}")
         response = requests.get(url, stream=True)
         response.raise_for_status()
         
         # Write to file:
         self._logger.info(f"Writing data to file {filename}")
         with open(self.dir / filename, 'wb') as file:
            for chunk in response.iter_content(chunk_size=8192):
               file.write(chunk)
               self._logger.debug(f"\tWrote chunk to {filename}")
      except Exception as e:   
         self._logger.exception(f"Failed to download file {filename}")
         return File.model_validate({"timestamp": datetime.now(), "filename": filename, "url": url, "status": "FAILURE", "seconds_elapsed": response.elapsed.total_seconds()})
      else:
         self._logger.info(f"Successfully wrote file {filename}")
         return File.model_validate({"timestamp": datetime.now(), "filename": filename, "url": url, "status": "SUCCESS", "seconds_elapsed": response.elapsed.total_seconds()})
      
   def _worker(self):
      while True:
         try:
            kwargs = self._q.get()
            if kwargs is None:
               self._q.task_done()
               break
            file: File = self._download(**kwargs)
            self._write_to_database(file)
            self._q.task_done()
         except:
            self._logger.exception("Error downloading file")
            self._q.task_done()