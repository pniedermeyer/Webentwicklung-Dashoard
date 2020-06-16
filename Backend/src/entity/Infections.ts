import { Column, Entity, Index } from 'typeorm'

@Index('infections_pkey', ['blId', 'date', 'lkId'], { unique: true })
@Entity('infections', { schema: 'public' })
export class Infections {
  @Column('integer', { primary: true, name: 'bl_id' })
  blId!: number

  @Column('integer', { primary: true, name: 'lk_id' })
  lkId!: number

  @Column('character varying', { name: 'bl_name', length: 255 })
  blName!: string

  @Column('character varying', { name: 'lk_name', length: 255 })
  lkName!: string

  @Column('integer', { name: 'cases' })
  cases!: number

  @Column('double precision', { name: 'cases_per_100k', precision: 53 })
  casesPer_100k!: number

  @Column('double precision', { name: 'cases_7_per_100k', precision: 53 })
  cases_7Per_100k!: number

  @Column('integer', { name: 'deaths' })
  deaths!: number

  @Column('date', { primary: true, name: 'date' })
  date!: string
}
