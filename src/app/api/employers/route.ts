import { searchEmployers } from "@/lib/employers";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;

  return Response.json(
    searchEmployers({
      query: params.get("q") ?? "",
      region: params.get("region") ?? "",
      sector: params.get("sector") ?? "",
      level: params.get("level") ?? "",
      page: Number(params.get("page") ?? "1"),
      pageSize: Number(params.get("pageSize") ?? "24"),
    }),
  );
}
