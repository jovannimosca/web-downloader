import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from models.file import FileRequest
from downloader import Downloader
from os import environ as env
from dotenv import load_dotenv

load_dotenv(dotenv_path="../.env")

origins = [
   "http://localhost",
   "http://localhost:8080",
   "http://localhost:3000",
   "http://localhost:5173",
]
if env.get("HOST"):
   origins.append(f'http://{env.get("WEB_HOST")}')
   origins.append(f'https://{env.get("WEB_HOST")}')

@asynccontextmanager
async def lifespan(app: FastAPI):
   global downloader
   downloader = Downloader(
      downloads_dir=env.get("DOWNLOADS_DIR", "~/Downloads"),
      database_host=env.get("DATABASE_HOST", "localhost"),
      database_name=env.get("DATABASE_NAME", "postgres"),
      database_user=env.get("DATABASE_USER", "postgres"),
      database_password=env.get("DATABASE_PASSWORD", ""),
   )
   yield
   downloader.close()

app = FastAPI(lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["OPTIONS", "GET", "POST"], allow_headers=["*"])

@app.get("/")
def test():
   return {"msg": "Success"}

@app.post("/downloads")
def download(request: FileRequest):
   try:
      result = downloader.get(request.url)
   except ValueError as e:
      raise HTTPException(status_code=400, detail=str(e))
   except:
      raise HTTPException(status_code=500, detail="Failed to download file")
   else:
      return result
   
@app.get("/downloads")
def status(page: int = 1, pageSize: int = 10):
   try:
      result = downloader.status(page, pageSize)
   except ValueError as e:
      raise HTTPException(status_code=400, detail=str(e))
   except:
      raise HTTPException(status_code=500, detail="Failed to retrieve status")
   else:
      return result
   
if __name__ == "__main__":
   uvicorn.run(app, host="127.0.0.1", port=8080)