import { Column, Entity, Index } from 'typeorm'

/**
 * Entity class for infections data.
 * When querying the database we get an array of instances of this class.
 */
@Index('infections_bl_pkey', ['id', 'date'], { unique: true })
@Entity('infectionsBL', { schema: 'public' })
export class InfectionsBL {
  @Column('integer', { primary: true, name: 'id' })
  id!: number

  @Column('character varying', { name: 'bl_name', length: 255 })
  name!: string

  @Column('date', { primary: true, name: 'date' })
  date!: string

  @Column('integer', { name: 'cases' })
  cases!: number

  @Column('double precision', { name: 'cases_per_100k' })
  casesPer_100k!: number

  @Column('double precision', { name: 'cases_7_per_100k' })
  cases_7Per_100k!: number

  @Column('integer', { name: 'change', default: 0 })
  change!: number

  @Column('integer', { name: 'deaths' })
  deaths!: number

  @Column('integer', { name: 'recovered' })
  recovered!: number
}
