import { Column, Entity, Index } from 'typeorm'

/**
 * Entity class for infections data.
 * When querying the database we get an array of instances of this class.
 */
@Index('infections_de_pkey', ['date'], { unique: true })
@Entity('infectionsDE', { schema: 'public' })
export class InfectionsDE {
  @Column('date', { primary: true, name: 'date' })
  date!: string

  @Column('integer', { name: 'cases' })
  cases!: number

  @Column('double precision', { name: 'cases_per_100k' })
  casesPer_100k!: number

  @Column('double precision', { name: 'cases_7_per_100k' })
  cases_7Per_100k!: number

  @Column('integer', { name: 'new_cases' })
  newCases!: number

  @Column('integer', { name: 'deaths' })
  deaths!: number

  @Column('integer', { name: 'recovered' })
  recovered!: number
}
