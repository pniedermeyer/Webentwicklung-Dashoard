import { getConnection } from "typeorm";

export default async function cleanupSettings() {
    await getConnection().query(`
        -- todo
    `)
}