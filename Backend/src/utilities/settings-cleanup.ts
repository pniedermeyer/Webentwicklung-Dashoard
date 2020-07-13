import { getConnection } from 'typeorm'

/**
 * Stub to delete the settings data, that is no longer needed.
 */
export default async function cleanupSettings () {
  await getConnection().query(`
    -- todo
  `)
}
