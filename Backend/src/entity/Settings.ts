import { Column, Entity } from "typeorm";

@Entity("settings", { schema: "public" })
export class Settings {
  @Column("text", { primary: true, name: "guid" })
  guid!: number;

  @Column("timestamp with time zone", { name: 'last_accessed', default: () => 'CURRENT_TIMESTAMP' })
  lastModified!: Date;

  @Column("jsonb", { name: "data" })
  data!: object;
}
