import { getConnection } from 'typeorm'

/**
 * Deletes the infections data, that is older than the last 2 weeks.
 */
export default async function cleanupInfections () {
  await getConnection().query(`
    DELETE FROM "settings" WHERE "last_accessed" < NOW() - INTERVAL '2 week';
  `)
}
