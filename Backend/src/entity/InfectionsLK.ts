import { Column, Entity, Index } from 'typeorm'

/**
 * Entity class for infections data.
 * When querying the database we get an array of instances of this class.
 */
@Index('infections_lk_pkey', ['lkId', 'date'], { unique: true })
@Entity('infectionsLK', { schema: 'public' })
export class InfectionsLK {
  @Column('integer', { primary: true, name: 'lk_id' })
  lkId!: number

  @Column('integer', { primary: true, name: 'bl_id' })
  blId!: number

  @Column('date', { primary: true, name: 'date' })
  date!: string

  @Column('character varying', { name: 'lk_full_name', length: 255 })
  fullName!: string

  @Column('character varying', { name: 'lk_given_name', length: 255 })
  givenName!: string

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
