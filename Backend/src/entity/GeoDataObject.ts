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

/*
geodata CREATE TABLE SCRIPT
-- Table: public.geodata

-- DROP TABLE public.geodata;

CREATE TABLE public.geodata
(
    bl_id integer NOT NULL,
    lk_id integer NOT NULL,
    x double precision[] NOT NULL,
    y double precision[] NOT NULL,
    ring_id integer NOT NULL,
    res integer NOT NULL,
    CONSTRAINT geodata_pkey PRIMARY KEY (bl_id, lk_id, ring_id, res)
)

TABLESPACE pg_default;

ALTER TABLE public.geodata
    OWNER to postgres;
*/
