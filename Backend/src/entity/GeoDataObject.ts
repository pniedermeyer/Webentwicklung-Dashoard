import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm'
import { FeatureCollection } from 'geojson'

@Index('geo_test_pkey', ['res'], { unique: true })
@Entity('geodataobjects', { schema: 'public' })
export class GeoDataObject {
  @Column('integer', { primary: true })
  res!: number

  @Column('jsonb')
  geojson!: FeatureCollection
}
