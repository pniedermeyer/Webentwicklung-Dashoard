import { Column, Entity, Index } from 'typeorm'
import { FeatureCollection } from 'geojson'

/**
 * Entity class for GeoJSON data.
 * When querying the database we want to query for a specific resolution.
 * The GeoJSON column contains the geojson which we want to provide.
 */
@Index('geo_test_pkey', ['res'], { unique: true })
@Entity('geodataobjects', { schema: 'public' })
export class GeoDataObject {
  @Column('integer', { primary: true })
  res!: number

  @Column('jsonb')
  geojson!: FeatureCollection
}
