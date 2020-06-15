import { Column, Entity, Index } from "typeorm";

@Index("settings_pkey", ["guid", "hash"], { unique: true })
@Entity("settings", { schema: "public" })
export class Settings {
  @Column("integer", { name: "lk_id" })
  lkId!: number;

  @Column("integer", { name: "bl_id" })
  blId!: number;

  @Column("integer", { name: "res" })
  res!: number;

  @Column("integer", { primary: true, name: "guid" })
  guid!: number;

  @Column("character varying", { primary: true, name: "hash", length: 255 })
  hash!: string;
}
