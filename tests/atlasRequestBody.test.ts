import assert from "node:assert/strict";
import { test } from "node:test";
import { readAtlasRequestBody, MAX_ATLAS_BODY_BYTES } from "../lib/intelligence/atlasRequestBody";
const request = (body: string, headers = {}) => new Request("https://example.com", { method: "POST", body, headers });
test("accept valid JSON at limit and reject above it", async () => {
  const body = JSON.stringify({ text: "x".repeat(MAX_ATLAS_BODY_BYTES - 11) });
  assert.equal(new TextEncoder().encode(body).length, MAX_ATLAS_BODY_BYTES);
  assert.equal((await readAtlasRequestBody(request(body))).ok, true);
  assert.deepEqual(await readAtlasRequestBody(request(body + " ")), { ok: false, status: 413, message: "Atlas request exceeds 50 KB." });
});
test("reject oversized declared and undeclared multibyte bodies", async () => {
  for (const req of [request("{}", { "content-length": "51201" }), request(JSON.stringify({ text: "é".repeat(30000) }))]) {
    const result = await readAtlasRequestBody(req);
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.status, 413);
  }
});
test("invalid JSON returns 400", async () => {
  const result = await readAtlasRequestBody(request("invalid"));
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.status, 400);
});
