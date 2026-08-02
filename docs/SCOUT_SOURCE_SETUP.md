# Scout lead-source connection

Scout is ready for Google Places Text Search (New).

Production environment variable:

```text
GOOGLE_PLACES_API_KEY=
```

The Google Cloud project must have billing enabled and Places API (New) enabled. Restrict the key to the Places API and to the production server environment where possible.

Scout makes three targeted Charlotte HVAC searches per daily run and requests only the fields used by the qualification queue. It deduplicates businesses by their Google place source URL, stores no private contact data, and never sends outreach automatically.

Without the key, Scout checks the OpenStreetMap public source once and reports the source ceiling honestly. OpenStreetMap returned no usable Charlotte HVAC records in the July 26, 2026 validation, so it is not sufficient as EMBUR's primary acquisition source.
