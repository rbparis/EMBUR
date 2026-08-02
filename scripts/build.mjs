import { spawnSync } from "node:child_process";
import { join } from "node:path";

const executable = (name) =>
  join(process.cwd(), "node_modules", ".bin", `${name}${process.platform === "win32" ? ".cmd" : ""}`);

function run(name, args) {
  const result = spawnSync(executable(name), args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (process.env.VERCEL === "1") {
  run("prisma", ["migrate", "deploy"]);
}

run("prisma", ["generate"]);
run("next", ["build"]);
