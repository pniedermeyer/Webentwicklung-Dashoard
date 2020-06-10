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
