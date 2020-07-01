import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm'
import { FeatureCollection } from 'geojson'

@Index('geo_test_pkey', ['id'], { unique: true })
@Entity('geotest', { schema: 'public' })
export class GeoTest {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('jsonb')
  geojson!: FeatureCollection
}
