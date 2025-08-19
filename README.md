# drizzle-zero Bug Reproduction

**Self-contained minimal reproduction case for Zero developers**

## Bug Description
drizzle-zero incorrectly maps `PgDateString` columns (created with `date("column", { mode: "string" })`) to `"number"` type in the Zero schema instead of `"string"` type.

## Expected vs Actual Behavior

**Expected:**
```typescript
// Drizzle Schema
birthDate: date("birth_date", { mode: "string" })

// Should generate Zero Schema
"birthDate": {
    "type": "string",
    "optional": true
}
```

**Actual:**
```typescript
// Drizzle Schema  
birthDate: date("birth_date", { mode: "string" })

// Actually generates Zero Schema
"birthDate": {
    "type": "number",  // ❌ WRONG! Should be "string"
    "optional": true
}
```

## Impact
- Database correctly stores dates as strings: `"1990-05-15"`
- Zero incorrectly sends timestamps: `641689200000`  
- Frontend receives numbers and experiences timezone shift: shows `"1990-05-14"` instead of `"1990-05-15"`

## Root Cause
In drizzle-zero source code (`src/drizzle-to-zero.ts`):

```javascript
var drizzleColumnTypeToZeroType = {
  PgDateString: "number",        // ❌ BUG: Should be "string"
  PgTimestampString: "number"    // This one might be correct
}
```

## Reproduction Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the full reproduction:**
   ```bash
   npm run repro
   ```

   Or run steps individually:

3. **See column introspection details:**
   ```bash
   npm test
   ```

4. **Generate Zero schema and demonstrate the bug:**
   ```bash
   npm run generate
   npm run demonstrate
   ```

5. **Check generated-schema.ts:**
   Look for the `birthDate` field - it will have `"type": "number"` instead of `"type": "string"`

## Fix
Change the type mapping in drizzle-zero:

```diff
var drizzleColumnTypeToZeroType = {
- PgDateString: "number",
+ PgDateString: "string",
  PgTimestampString: "number"
}
```

## Environment
- drizzle-zero: 0.13.2
- @rocicorp/zero: 0.22.2025080200  
- drizzle-orm: 0.44.3
