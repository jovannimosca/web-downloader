import axios from "axios";
import { FileRequest, StatusRequest } from "../types/api";
// import * as dotenv from "dotenv";

// dotenv.config({ path: "../../.env", debug: true });

const client = axios.create({
   baseURL: import.meta.env.FE_API_URL,
});

export function postDownload(data: FileRequest) {
   return client.post("downloads", data);
}

export function getDownloads(params: StatusRequest) {
   return client.get("downloads", {
      params,
   });
}
