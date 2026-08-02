async function main() {
  const response = await fetch("https://www2.myfloridalicense.com/sto/file_download/extracts//CONSTRUCTIONLICENSE_1.csv", {
    headers: {
      "User-Agent": "EMBUR-Scout/1.0 (+https://getembur.com)",
    },
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) throw new Error(`Florida DBPR returned ${response.status}.`);
  const text = await response.text();
  const counts = new Map<string, number>();
  for (const line of text.split(/\r?\n/)) {
    if (!line) continue;
    const columns = line.slice(1, -1).split('","');
    const code = columns[1];
    counts.set(code, (counts.get(code) ?? 0) + 1);
  }
  console.log(JSON.stringify({
    bytes: text.length,
    classCodes: [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0])),
  }, null, 2));
}

void main();
