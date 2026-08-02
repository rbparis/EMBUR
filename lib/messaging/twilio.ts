import twilio from "twilio";

export type SmsDeliveryMode = "disabled" | "test" | "live";

type SendSmsInput = {
  to: string;
  body: string;
  statusCallback: string;
};

function clean(value: string | undefined) {
  return value?.trim() ?? "";
}

export function getSmsDeliveryMode(): SmsDeliveryMode {
  const mode = clean(process.env.SMS_DELIVERY_MODE).toLowerCase();
  return mode === "test" || mode === "live" ? mode : "disabled";
}

export function normalizeSmsPhone(value: string | null | undefined) {
  if (!value) return null;
  const trimmed = value.trim();

  if (/^\+[1-9]\d{7,14}$/.test(trimmed)) {
    return trimmed;
  }

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

export function messagingReadiness() {
  const mode = getSmsDeliveryMode();
  const accountSid = clean(process.env.TWILIO_ACCOUNT_SID);
  const authToken = clean(process.env.TWILIO_AUTH_TOKEN);
  const messagingServiceSid = clean(process.env.TWILIO_MESSAGING_SERVICE_SID);
  const fromNumber = normalizeSmsPhone(process.env.TWILIO_PHONE_NUMBER);
  const testNumber = normalizeSmsPhone(process.env.SMS_TEST_TO_NUMBER);
  const complianceStatus = clean(process.env.TWILIO_COMPLIANCE_STATUS).toLowerCase() || "unregistered";
  const providerConfigured = Boolean(
    accountSid
      && authToken
      && (messagingServiceSid || fromNumber)
  );
  const testReady = providerConfigured && Boolean(testNumber);
  const liveReady = providerConfigured && complianceStatus === "approved";

  return {
    mode,
    providerConfigured,
    testReady,
    liveReady,
    complianceStatus,
    senderType: messagingServiceSid ? "messaging_service" as const : fromNumber ? "phone_number" as const : "missing" as const,
    testNumber,
  };
}

function requireTwilioConfig() {
  const accountSid = clean(process.env.TWILIO_ACCOUNT_SID);
  const authToken = clean(process.env.TWILIO_AUTH_TOKEN);
  const messagingServiceSid = clean(process.env.TWILIO_MESSAGING_SERVICE_SID);
  const fromNumber = normalizeSmsPhone(process.env.TWILIO_PHONE_NUMBER);

  if (!accountSid || !authToken || (!messagingServiceSid && !fromNumber)) {
    throw new Error("Texting is not connected yet. Add the Twilio credentials and sender in Vercel.");
  }

  return { accountSid, authToken, messagingServiceSid, fromNumber };
}

export async function sendSms(input: SendSmsInput) {
  const mode = getSmsDeliveryMode();
  const config = requireTwilioConfig();
  const requestedRecipient = normalizeSmsPhone(input.to);

  if (!requestedRecipient) {
    throw new Error("This customer needs a valid text-capable phone number.");
  }

  if (mode === "disabled") {
    throw new Error("Text delivery is safely disabled until a Twilio sender is connected.");
  }

  const testRecipient = normalizeSmsPhone(process.env.SMS_TEST_TO_NUMBER);
  if (mode === "test" && !testRecipient) {
    throw new Error("Test mode needs SMS_TEST_TO_NUMBER before any text can be sent.");
  }

  if (mode === "live" && messagingReadiness().complianceStatus !== "approved") {
    throw new Error("Live texting is locked until carrier registration is approved.");
  }

  const recipient = mode === "test" ? testRecipient! : requestedRecipient;
  const client = twilio(config.accountSid, config.authToken);
  const message = await client.messages.create({
    to: recipient,
    body: input.body,
    statusCallback: input.statusCallback,
    ...(config.messagingServiceSid
      ? { messagingServiceSid: config.messagingServiceSid }
      : { from: config.fromNumber! }),
  });

  return {
    sid: message.sid,
    status: message.status,
    recipient,
    requestedRecipient,
    mode,
  };
}

export function validateTwilioWebhook(
  signature: string | null,
  url: string,
  params: Record<string, string>,
) {
  const authToken = clean(process.env.TWILIO_AUTH_TOKEN);
  if (!authToken || !signature) return false;
  return twilio.validateRequest(authToken, signature, url, params);
}

export function publicWebhookUrl(request: Request) {
  const configuredBase = clean(process.env.TWILIO_WEBHOOK_BASE_URL)
    || clean(process.env.APP_URL);
  const incoming = new URL(request.url);

  if (!configuredBase) return incoming.toString();

  const base = new URL(configuredBase);
  base.pathname = incoming.pathname;
  base.search = incoming.search;
  base.hash = "";
  return base.toString();
}

export async function readTwilioForm(request: Request) {
  const formData = await request.formData();
  const params: Record<string, string> = {};

  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") params[key] = value;
  }

  return params;
}

export function emptyTwiml() {
  return new Response("<?xml version=\"1.0\" encoding=\"UTF-8\"?><Response></Response>", {
    status: 200,
    headers: { "Content-Type": "text/xml; charset=utf-8" },
  });
}
