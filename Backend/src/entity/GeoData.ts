import { Column, Entity, Index } from 'typeorm'

@Index('geo_data_pkey', ['blId', 'lkId', 'res', 'ringId'], { unique: true })
@Entity('geodata', { schema: 'public' })
export class GeoData {
  @Column('integer', { primary: true, name: 'bl_id' })
  blId!: number

  @Column('integer', { primary: true, name: 'lk_id' })
  lkId!: number

  @Column('integer', { primary: true, name: 'ring_id' })
  ringId!: number

  @Column('integer', { primary: true, name: 'res' })
  res!: number

  @Column('float8', { name: 'x', array: true })
  x!: number[]

  @Column('float8', { name: 'y', array: true })
  y!: number[]
}
