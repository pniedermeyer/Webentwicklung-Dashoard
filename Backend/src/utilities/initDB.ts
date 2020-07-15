import { getConnection } from 'typeorm'
import { GeoDataObject } from '../entity/GeoDataObject'
import GeoDataController from '../controllers/GeodataController'
import { infectionDE } from '../rawInfectionData/infectionsDE'
import { infectionBL } from '../rawInfectionData/infectionsBL'
import { infectionLK } from '../rawInfectionData/infectionsLK'
import { InfectionsDE } from '../entity/InfectionsDE'
import { InfectionsBL } from '../entity/InfectionsBL'
import { InfectionsLK } from '../entity/InfectionsLK'

/**
 * Saves GeoJSON in different resolutions when there is no data yet in that table
 */
export async function initGeoData() {
  let sum: number = await getConnection().getRepository(GeoDataObject).count()
  if (sum === 0) {
    await GeoDataController.writeGeoDataInResolution('low')
    console.log('GeoJSON resolution added to DB: low')
    await GeoDataController.writeGeoDataInResolution('medium')
    console.log('GeoJSON resolution added to DB: medium')
    await GeoDataController.writeGeoDataInResolution('high')
    console.log('GeoJSON resolution added to DB: high')
    await GeoDataController.writeGeoDataInResolution('original')
    console.log('GeoJSON resolution added to DB: original')
  }
}

export async function initInfectionData() {
  let sum: number = await getConnection().getRepository(InfectionsDE).count()
  console.log('Infection: ', sum)
  if (sum === 0) {
    try {
      await getConnection().getRepository(InfectionsDE).insert(infectionDE)
    } catch (e) {}
    try {
      await getConnection().getRepository(InfectionsBL).insert(infectionBL)
    } catch (e) {}
    try {
      await getConnection().getRepository(InfectionsLK).insert(infectionLK)
    } catch (e) {}
  }
}
