const placeholderPattern = /USERNAME|PASSWORD|something|your-endpoint|REGION|CHANGE_ME|\[SENSITIVE\]/i;

function isPlaceholder(value: string | undefined): boolean {
  return !value || placeholderPattern.test(value) || value.trim().length === 0;
}

export function resolveDatabaseUrl(env: NodeJS.ProcessEnv = process.env) {
  const candidates = [env.DATABASE_URL, env.DATABASE_URL_UNPOOLED, env.DIRECT_URL];

  for (const candidate of candidates) {
    if (!isPlaceholder(candidate)) {
      return candidate;
    }
  }

  return env.DATABASE_URL ?? env.DATABASE_URL_UNPOOLED ?? env.DIRECT_URL;
}
