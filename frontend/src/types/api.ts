export type FileRequest = {
   url: string;
   filename?: string;
};

export type StatusRequest = {
   page?: number;
   pageSize?: number;
};

export type StatusResponse = {
   page: number;
   pageSize: number;
   rowCount: number;
   data: File[];
};

export type File = {
   id: string;
   timestamp: string;
   filename: string;
   url: string;
   status: string;
   seconds_elapsed: number;
};
