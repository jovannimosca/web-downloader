import axios from "axios";
import { FileRequest, StatusRequest } from "../types/api";
import * as dotenv from "dotenv";

dotenv.config();

const client = axios.create({
   baseURL: `http://${process.env.HOST || "127.0.0.1"}:8080/`,
});

export function postDownload(data: FileRequest) {
   return client.post("downloads", data);
}

export function getDownloads(params: StatusRequest) {
   return client.get("downloads", {
      params,
   });
}
