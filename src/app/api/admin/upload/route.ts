import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-session";

export async function POST(request: Request): Promise<NextResponse> {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;
  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        if (!(await hasAdminSession())) throw new Error("Not authorized.");
        const payload = clientPayload ? (JSON.parse(clientPayload) as { kind?: string }) : {};
        if (payload.kind === "doc") {
          return {
            allowedContentTypes: ["application/pdf"],
            maximumSizeInBytes: 20 * 1024 * 1024,
            addRandomSuffix: false,
            allowOverwrite: false,
          };
        }
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp"],
          maximumSizeInBytes: 15 * 1024 * 1024,
          addRandomSuffix: false,
          allowOverwrite: false,
        };
      },
    });

    return NextResponse.json(json);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed." },
      { status: 400 },
    );
  }
}
