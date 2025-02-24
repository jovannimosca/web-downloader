from pydantic import BaseModel, Field
from datetime import datetime, timedelta
from typing import Optional, Literal

class File(BaseModel):
   id: Optional[str] = Field(default=None)
   timestamp: datetime
   filename: str = Field(min_length=1)
   url: str = Field(min_length=1, pattern="^https?://")
   status: Literal["SUCCESS", "FAILURE"]
   seconds_elapsed: timedelta

class FileRequest(BaseModel):
   url: str
   filename: Optional[str] = Field(default=None)
   
class FileResponse(BaseModel):
   filename: str
   
class StatusResponse(BaseModel):
   page: int
   pageSize: int
   rowCount: int
   data: list[File]