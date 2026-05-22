import bot from "@/lib/telegram-bot";

// a simple 1x1 transparent png as fallback
const FALLBACK = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "base64"
);

function errorResponse(status: number) {
  return new Response(FALLBACK, {
    status,
    headers: { "Content-Type": "image/png" },
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await params;

    if (!fileId) return errorResponse(400);

    const decodedFileId = decodeURIComponent(fileId);
    const file = await bot.api.getFile(decodedFileId);
    const filePath = file.file_path;

    if (!filePath) return errorResponse(404);

    const telegramUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${filePath}`;
    const response = await fetch(telegramUrl);

    if (!response.ok) return errorResponse(response.status);

    return new Response(response.body, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
        "Content-Disposition": `inline; filename="${filePath.split("/").pop()}"`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return errorResponse(500);
  }
}