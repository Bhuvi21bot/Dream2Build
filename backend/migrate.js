import { auth } from "./src/auth.js";
import { pool } from "./src/db.js";

async function main() {
    try {
        await pool.query("ALTER TABLE account ADD COLUMN issuer text");
        console.log("Migration successful: added issuer column to account table.");
    } catch (e) {
        if (e.code === 'ER_DUP_FIELDNAME') {
            console.log("Column issuer already exists.");
        } else {
            console.error("Migration failed:", e);
        }
    } finally {
        process.exit(0);
    }
}
main();
