import { prisma } from "@/lib/prisma";

type OverpassElement = {
  id: number;
  type: "node" | "way" | "relation";
  tags?: Record<string, string>;
};

type OverpassResponse = {
  elements?: OverpassElement[];
};

const sourceUrl = "https://overpass-api.de/api/interpreter";
const primaryMarket = {
  name: "Charlotte, North Carolina",
  wikidata: "Q16565",
};
const growthMarkets = [
  primaryMarket,
  { name: "Raleigh, North Carolina", wikidata: "Q41087" },
];

function clean(value: string | undefined, limit = 300) {
  return value?.trim().slice(0, limit) || null;
}

function streetAddress(tags: Record<string, string>) {
  const line = [tags["addr:housenumber"], tags["addr:street"]].filter(Boolean).join(" ");
  const city = tags["addr:city"];
  const state = tags["addr:state"];
  return clean([line, city, state].filter(Boolean).join(", "), 300);
}

function businessWebsite(tags: Record<string, string>) {
  return clean(tags.website || tags["contact:website"] || tags.url, 500);
}

function businessPhone(tags: Record<string, string>) {
  return clean(tags.phone || tags["contact:phone"], 100);
}

export async function collectScoutProspects(businessId: string) {
  const googleApiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
  if (googleApiKey) {
    return collectGooglePlacesProspects(businessId, googleApiKey);
  }

  const query = [
    "[out:json][timeout:25];",
    `area["wikidata"="${primaryMarket.wikidata}"]->.market;`,
    "(",
    'nwr["craft"="hvac"](area.market);',
    'nwr["name"~"HVAC|Heating|Cooling|Air Conditioning",i](area.market);',
    ");",
    "out center tags 80;",
  ].join("");

  const response = await fetch(sourceUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      "User-Agent": "EMBUR-Scout/1.0 (+https://getembur.com)",
    },
    body: new URLSearchParams({ data: query }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    throw new Error(`Public business source returned ${response.status}.`);
  }

  const payload = (await response.json()) as OverpassResponse;
  const unique = new Map<string, OverpassElement>();
  for (const element of payload.elements ?? []) {
    const name = clean(element.tags?.name, 160);
    if (!name) continue;
    unique.set(`${element.type}/${element.id}`, element);
  }

  let created = 0;
  let updated = 0;
  for (const [sourceId, element] of unique) {
    const tags = element.tags ?? {};
    const publicSourceUrl = `https://www.openstreetmap.org/${sourceId}`;
    const existing = await prisma.outreachProspect.findUnique({
      where: {
        businessId_sourceUrl: {
          businessId,
          sourceUrl: publicSourceUrl,
        },
      },
      select: { id: true },
    });
    await prisma.outreachProspect.upsert({
      where: {
        businessId_sourceUrl: {
          businessId,
          sourceUrl: publicSourceUrl,
        },
      },
      create: {
        businessId,
        company: tags.name.trim().slice(0, 160),
        email: null,
        website: businessWebsite(tags),
        location: streetAddress(tags) || primaryMarket.name,
        notes: [
          businessPhone(tags) ? `Public phone: ${businessPhone(tags)}` : null,
          "Public HVAC business record; contact details must be verified before outreach.",
        ].filter(Boolean).join(" "),
        sourceUrl: publicSourceUrl,
        stage: "research",
      },
      update: {
        company: tags.name.trim().slice(0, 160),
        website: businessWebsite(tags),
        location: streetAddress(tags) || primaryMarket.name,
        notes: [
          businessPhone(tags) ? `Public phone: ${businessPhone(tags)}` : null,
          "Public HVAC business record; contact details must be verified before outreach.",
        ].filter(Boolean).join(" "),
      },
    });
    if (existing) updated++;
    else created++;
  }

  return {
    source: "OpenStreetMap",
    market: primaryMarket.name,
    found: unique.size,
    created,
    updated,
    attribution: "© OpenStreetMap contributors, ODbL",
    attributionUrl: "https://www.openstreetmap.org/copyright",
  };
}

type GooglePlace = {
  id: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  nationalPhoneNumber?: string;
  websiteUri?: string;
  googleMapsUri?: string;
};

async function collectGooglePlacesProspects(businessId: string, apiKey: string) {
  const queries = growthMarkets.flatMap((market) => [
    `HVAC contractors in ${market.name}`,
    `heating and air conditioning contractors in ${market.name}`,
    `emergency HVAC service in ${market.name}`,
  ]);
  const places = new Map<string, GooglePlace>();

  for (const textQuery of queries) {
    const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": [
          "places.id",
          "places.displayName",
          "places.formattedAddress",
          "places.nationalPhoneNumber",
          "places.websiteUri",
          "places.googleMapsUri",
        ].join(","),
      },
      body: JSON.stringify({ textQuery, pageSize: 20 }),
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Google Places returned ${response.status}: ${message.slice(0, 180)}`);
    }
    const payload = await response.json() as { places?: GooglePlace[] };
    for (const place of payload.places ?? []) {
      if (place.id && place.displayName?.text) places.set(place.id, place);
    }
  }

  let created = 0;
  let updated = 0;
  for (const place of places.values()) {
    const publicSourceUrl = place.googleMapsUri || `https://www.google.com/maps/search/?api=1&query_place_id=${encodeURIComponent(place.id)}`;
    const existing = await prisma.outreachProspect.findUnique({
      where: { businessId_sourceUrl: { businessId, sourceUrl: publicSourceUrl } },
      select: { id: true },
    });
    await prisma.outreachProspect.upsert({
      where: { businessId_sourceUrl: { businessId, sourceUrl: publicSourceUrl } },
      create: {
        businessId,
        company: place.displayName!.text!.trim().slice(0, 160),
        email: null,
        website: clean(place.websiteUri, 500),
        location: clean(place.formattedAddress, 300) || growthMarkets[0].name,
        notes: [
          place.nationalPhoneNumber ? `Public phone: ${place.nationalPhoneNumber}` : null,
          "Google Places business record; contact details must be verified before outreach.",
        ].filter(Boolean).join(" "),
        sourceUrl: publicSourceUrl,
        stage: "research",
      },
      update: {
        company: place.displayName!.text!.trim().slice(0, 160),
        website: clean(place.websiteUri, 500),
        location: clean(place.formattedAddress, 300) || growthMarkets[0].name,
        notes: [
          place.nationalPhoneNumber ? `Public phone: ${place.nationalPhoneNumber}` : null,
          "Google Places business record; contact details must be verified before outreach.",
        ].filter(Boolean).join(" "),
      },
    });
    if (existing) updated++;
    else created++;
  }

  return {
    source: "Google Places",
    market: growthMarkets.map((market) => market.name).join(" + "),
    found: places.size,
    created,
    updated,
    attribution: "Google Places",
    attributionUrl: "https://developers.google.com/maps/documentation/places/web-service/policies",
  };
}
