import { Column, Entity } from "typeorm";

enum Metric {
    CASES = 'cases',
    CASES_PER_100K = 'cases_per_100_k',
    CASES7_PER_100K = 'cases7_per_100_K'
}

@Entity("settings", { schema: "public" })
export class Settings {
  public static readonly Metric = Metric;

  @Column("integer", { primary: true, name: "guid" })
  guid!: number;

  @Column("integer", { name: "zoom" })
  zoom!: number;

  @Column("integer", { name: "graphs_shown" })
  graphsShown!: number;

  @Column("integer", { name: "lk_id" })
  lkId!: number;

  @Column("integer", { name: "bl_id" })
  blId!: number;

  @Column("text", { name: "metric" })
  metric!: Metric;

  @Column("text", { name: "table" })
  table!: number[][];
}
