## Key Configuration & Constants

This section outlines critical configuration values that **must be treated with extreme care** as their loss or alteration can have severe consequences for application functionality and data integrity.

### Firebase UUIDv5 Namespace

**Purpose:** This UUID is the deterministic namespace used to generate unique user IDs (`userId`) in our backend database from Firebase Authentication UIDs. It ensures that a given Firebase UID always maps to the same `userId`.

**CRITICALITY:** **DO NOT LOSE OR ALTER THIS VALUE.** Losing this UUID will break the mapping for all existing users, rendering their backend profiles inaccessible via Firebase UIDs. Altering it will cause all existing Firebase UIDs to map to *new*, incorrect `userId`s.

**Value:** `bac0a539-0cbb-42e9-9203-44367635d7a3`

**Location:** This value is primarily sourced from the `USER_UUID_NAMESPACE` environment variable. Ensure it's correctly set in `.env` for development and in your hosting provider's environment variables for all deployed environments.
