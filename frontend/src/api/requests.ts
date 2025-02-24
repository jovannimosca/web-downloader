import axios from "axios";
import { FileRequest, StatusRequest } from "../types/api";

const client = axios.create({
   baseURL: "http://localhost:8080/",
});

export function postDownload(data: FileRequest) {
   return client.post("downloads", data);
}

export function getDownloads(params: StatusRequest) {
   return client.get("downloads", {
      params,
   });
}
