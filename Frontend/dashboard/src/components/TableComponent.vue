<template>
  <div>
  <b-card no-body>
    <b-tabs card>
      <b-tab title="Tabelle 1" active>
          <b-table striped hover :tabitems="tabitems"></b-table>
          <v-select  label="name" :options="views" :reduce="views => views.LK_ID"></v-select>
      </b-tab>
      <b-tab title="Tabelle 2">
           <b-table striped hover :tabitems="tabitems"></b-table>
      </b-tab>
    </b-tabs>
  </b-card>

  <b-table striped hover :tabitems="tabitems"></b-table>
  </div>
</template>

<script>
  export default {
    name: 'infectionTable',
    props: {
      infectionData: {
        type: Object
      },
    },
    data() {
      return {
        tab:null,
        tabitems: [
          { tab: 'One', content: 'Tab 1 Content' },
          { tab: 'Two', content: 'Tab 2 Content' },
          { tab: 'Three', content: 'Tab 3 Content' },
        ],
        items: [
          { name: 48, cases: 'Andre', casesper100k: 'Miede', cases7per100k: 'Flaschen', death: 'Jo' },
/*        { age: 24, first_name: 'Thomas', last_name: 'Kretschmer' },
          { age: 89, first_name: 'Klaus', last_name: 'Berberich' },
          { age: 38, first_name: 'Helmut', last_name: 'Folz' } */
        ],
        views: views
      }
    }
  }

  /**
    name: String
    cases: Number
    casesPer100k: Number
    cases7Per100k: Number
    death: number
   */
/*   function selectedArea (data, BLID, LKID) {
    if (LKID){
      let state = data.states.find(element => element.BL_ID == BLID).counties
      let county = state.find(element => element.LK_ID == LKID)
      return buildObject(county.LK, county.cases_LK, county.cases_per_100k_LK, county.cases7_per_100k_LK, county.deaths_LK)
    } else if (BLID) {
        let state = data.states.find(element => element.BL_ID == BLID).counties
        return buildObject(state.name, state.cases_BL, state.cases_per_100k_BL, state.cases7_per_100k_BL, state.deaths_BL)
    } else {
      return buildObject(data.name, data.cases_DE, data.cases_per_100k_DE, data.cases7_per_100k_DE, data.deaths_DE)
    }
  }


  function buildObject (coutry, state=null, county=null){
    let dataObject={};

    dataObject.casesInGer = county.cases_DE;
    dataObject.cases_per_
    
  } */

//id, name, wo angezeigt wird(1=Land, 2=Bundesland, 3=Landkreis)
 
  const views = [
    {id: 0, name: 'Name des Landes', label: 'Land', correspondingTO: 1},
    {id: 2, name: 'Infektionen des Landes', label: 'Infektionen nat.', correspondingTO: 1},
    {id: 4, name: 'Anzahl Tote des Landes', label:'Tote nat.', correspondingTO: 1},
    {id: 6, name: 'Infektionen pro 100k des Landes', label:'Infektionen nat. pro 100k ', correspondingTO: 1},
    {id: 8, name: 'Infektionen der letzen 7 Tage pro 100k des landes', label:'Infekt. nat. letze 7 Tage/100k', correspondingTO: 1},
    {id: 10, name: 'Genesene des Landes', label:'Genesene nat.', correspondingTO: 1},
    {id: 12, name: 'Vergleich zu vorherigem Tag des Landes', label:'Vergleich Tag zuvor nat.', correspondingTO: 1},
    

    {id: 1, name: '', label:'', correspondingTO: 1},
  ]


</script>