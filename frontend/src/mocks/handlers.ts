import { http, HttpResponse } from "msw";
import { FileRequest, StatusResponse } from "@/types/api";

const API_URL: string = import.meta.env.FE_API_URL || "http://localhost:8080";

export const handlers = [
  http.get<{ page?: string; pageSize?: string }, never, StatusResponse>(
    `${API_URL}/downloads`,
    async ({ request }) => {
      const url = new URL(request.url);
      const page: number = parseInt(url.searchParams.get("page") || "0", 10);
      const pageSize: number = parseInt(
        url.searchParams.get("pageSize") || "10",
        10,
      );
      const totalFiles = 50; // Simulate a total of 50 files
      const start = (page - 1) * pageSize;
      const data = Array.from({ length: pageSize }, (_, index) => ({
        id: `file-${start + index + 1}`,
        timestamp: new Date().toISOString(),
        filename: `file-${start + index + 1}.txt`,
        url: `http://example.com/file-${start + index + 1}.txt`,
        status: "SUCCESS",
        seconds_elapsed: Math.floor(Math.random() * 100),
      })).filter((_, index) => start + index < totalFiles);
      return HttpResponse.json<StatusResponse>({
        page,
        pageSize,
        rowCount: totalFiles,
        data,
      });
    },
  ),

  http.post<FileRequest>(`${API_URL}/downloads`, async ({ request }) => {
    const { url, filename } = await request.clone().json();

    if (!url) {
      return HttpResponse.json({ error: "URL is required" }, { status: 400 });
    }

    return HttpResponse.json({
      filename: filename || "default_filename.txt",
    });
  }),
];
