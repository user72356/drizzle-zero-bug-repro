import { users } from "./schema.ts";

console.log("=== Drizzle-Zero Bug Reproduction ===\n");

// Get the Drizzle column definition  
const birthDateColumn = users.birthDate;

console.log("1. Drizzle Schema Definition:");
console.log(`   Field: birthDate = date("birth_date", { mode: "string" })`);
console.log(`   Expected: String-based date field\n`);

console.log("2. Drizzle Column Introspection:");
console.log(`   Column Type: ${birthDateColumn.columnType}`);
console.log(`   Data Type: ${birthDateColumn.dataType}`);
console.log(`   Constructor: ${birthDateColumn.constructor.name}\n`);

// Show the drizzle-zero type mapping (from source code analysis)
console.log("3. drizzle-zero Type Mapping (from source code):");
console.log("   var drizzleColumnTypeToZeroType = {");
console.log("     PgDateString: \"number\",  // ❌ WRONG! Should be \"string\"");
console.log("     PgTimestampString: \"number\"");
console.log("   };\n");

console.log("4. Expected vs Actual Zero Schema:");
console.log("   Expected: birthDate: { \"type\": \"string\", \"optional\": true }");
console.log("   Actual:   birthDate: { \"type\": \"number\", \"optional\": true }\n");

console.log("5. Impact:");
console.log("   - Database stores: \"1990-05-15\" (date string)");
console.log("   - Zero sends: 641689200000 (timestamp number)");
console.log("   - Frontend gets: 1990-05-14 (timezone shift by 1 day)\n");

console.log("6. Fix:");
console.log("   Change PgDateString mapping from \"number\" to \"string\" in drizzle-zero");

// Try to generate the schema to show the actual output
try {
    console.log("\n=== Run 'npm run generate' to see the actual generated Zero schema ===");
} catch (error) {
    console.log("Error:", error.message);
}
