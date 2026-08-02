import dotenv from "dotenv";

dotenv.config({ path: [".env.local", ".env"], quiet: true });

const secret = process.env.CRON_SECRET;
if (!secret) {
  console.error("CRON_SECRET is not available in the local environment.");
  process.exit(2);
}

const response = await fetch("https://getembur.com/api/agents/run-daily", {
  headers: { authorization: `Bearer ${secret}` },
});
const result = await response.json();

console.log(JSON.stringify({
  status: response.status,
  success: result.success,
  businesses: result.businesses,
  executions: result.results?.[0]?.executions?.map((execution) => ({
    agent: execution.agent,
    status: execution.status,
  })),
}, null, 2));

if (!response.ok) process.exit(1);
