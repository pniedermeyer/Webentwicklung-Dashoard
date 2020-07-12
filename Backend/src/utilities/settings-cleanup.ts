import { getConnection } from "typeorm";

export default async function cleanupSettings() {
    await getConnection().query(`
        DELETE FROM "settings" WHERE "last_accessed" < NOW() - INTERVAL '2 week';
    `)
}