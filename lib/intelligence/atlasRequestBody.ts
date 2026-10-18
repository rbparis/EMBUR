export const MAX_ATLAS_BODY_BYTES = 50 * 1024;

type Result = { ok: true; value: unknown } | { ok: false; status: 400 | 413; message: string };
const tooLarge = (): Result => ({ ok: false, status: 413, message: "Atlas request exceeds 50 KB." });

// Count streamed bytes too: Content-Length may be absent or inaccurate.
export async function readAtlasRequestBody(request: Request): Promise<Result> {
  const declared = request.headers.get("content-length");
  if (declared && Number(declared) > MAX_ATLAS_BODY_BYTES) return tooLarge();
  if (!request.body) return { ok: false, status: 400, message: "The Atlas request was not valid JSON." };
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_ATLAS_BODY_BYTES) {
        await reader.cancel().catch(() => {});
        return tooLarge();
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    return { ok: true, value: JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)) };
  } catch {
    return { ok: false, status: 400, message: "The Atlas request was not valid JSON." };
  } finally {
    reader.releaseLock();
  }
}
