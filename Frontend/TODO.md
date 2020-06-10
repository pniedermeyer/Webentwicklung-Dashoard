Balkendiagramm:
  Fälle/100.000 - BL+LK
    Benötigte Daten:
      BL: 
        request: "barchart/BL"
        response: [
          BL_ID: number/string {The ID of the BL}
          Name: string  {The name of the BL}
          case100k: number {The cases/100.000 in the BL}
        ]
        option: LK direkt hier mit übergeben
        
      LK: 
        request: "barchart/LK"
        response: [
          BL_ID: number/string {The ID of the parent BL}
          LK_ID: number/string {The ID of the LK}
          Name: string {The name of the LK}
          case100k: number {The cases/100.000 in the LK}
        ]
    
    
Letzte 7 Tage - BL+LK
  Stage 2, wenn obiges funktioniert


Wenn Bl ausgewählt wird (karte - dropdown), aufruf einer Update funktion und Wechsel von BL -> LK


Table:

3 Modi: Kein Bundesland ausgewählt, BL ausgewählt, Lk ausgewählt
  request:  "/table/"
            "/table/BL/{BL_ID}"
            "/table/LK/{LK_ID}"
            
  response: {
              name:string {BL name, LK name + BL name, "Deutschland"}
              cases: number {The cases in BL/LK/GER}
              (casesInBL: number {The cases in BL, only needed if LK is selected}
              casesInGer: number {The total cases in Ger, only needed if BL/Lk is selected}) optional
              casesPer100k: number {The cases in the BL/LK/Ger per 100.000}
              change: number {The difference to the previous day}
              change7: number {The difference of the last 7 days}
              cases7per100k: number {The cases in the last 7 days per 100.000}
              (lockdownPercent: number {Percentage till new Lockdown enforced, only if LK is selected}) possible?
              (reproductionRate: number {The reproduction rate in the BL/LK/Ger (bsp. 0,8)}) possible?
              death: number {The total deaths of LK/BL/Ger}
              (lastUpdated: date {Date of last update}) possible?
              


Optional: barchart für altersgruppen (mit Todesrate). Ist das möglich?

