<template>
  <div>
    <div>

    <div id="zoomer">
      <h1>Auflösung</h1>
      <v-slider v-model= "zoomstufe" v-bind="zoomsliderOptions" :data="['basycs', 'etwas Wilder', 'Zu Wild', '10/10']" ></v-slider>
    </div>
      <h1>🗺️Bundesland</h1>
      <v-select
        v-model="BL_ID"
        label="name"
        :options="states"
        :reduce="(item) => item.BL_ID"
        @input="setSelState"
        :clearable="false"
      ></v-select>
    </div>
    <div>
      <h1>🗾Landkreis</h1>
      <v-select v-model="LK_ID" label="LK" :options="counties" :reduce="(item) => item.LK_ID" :clearable="false" @input="setSelCounty"></v-select>
    </div>
    <div>
      <h1>💯Fallzahlen</h1>
      <v-select v-model="casesOption" :options="allCasesOptions" :reduce="(option) => option.code" :clearable="false"></v-select>
    </div>
    <div>
      <button v-on:click="saveUserSettings()">💾Einstellungen speichern</button>
    </div>
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

export default {
  data: () => ({
    states: [{BL_ID: 0, name: 'Alle'}],
    selectedState: null,
    counties: [''],
    selectedCounty: null,
    zoomstufe: '',
    zoomsliderOptions: {
      min: 0,
      interval: 1,
      max: 3,
      marks: true
    }
  }),
  methods: {
    setSelState(value) {
      this.LK_ID = null
      this.selectCountiesToState(value)
    },
    setSelCounty(value){
      if(!this.BL_ID){
        console.log(value)
        this.BL_ID = this.counties.find(e => e.LK_ID == value).BL_ID;
        this.selectCountiesToState(this.BL_ID)
      }
    },
    selectCountiesToState(stateId) {
      if (stateId != 0) {
        let state = this.states.find((state) => state.BL_ID === stateId)
        let tempCounties = state.counties
        tempCounties.sort(function(a, b){
          return a.LK < b.LK ? -1 : 1
        })
        this.counties = tempCounties
      } else {
       let tempCounties = []
       for (let i = 1; i < this.states.length; i++)
        this.states[i].counties.forEach(county => {
          county.BL_ID = this.states[i].BL_ID
          tempCounties.push(county)
        })
        tempCounties.sort(function(a, b){
          return a.LK < b.LK ? -1 : 1
        })
        this.counties = tempCounties
      }
      this.selectedCounty = null
    },
    saveUserSettings() {
      //Hier Settings speichern!
      console.log('Jetzt könnten wir speichern!')
    },
  },
  watch: {
    infectionData: function() {
      initStates(this)
      this.selectCountiesToState(this.BL_ID)
    },
  },
  mounted() {
    initStates(this)
    this.selectCountiesToState(this.BL_ID)
    // this.states = this.infectionData.states
  },
  computed: {
    ...mapFields({
      BL_ID : 'BL_ID',
      LK_ID : 'LK_ID',
      casesOption : 'casesOption',
      allCasesOptions : 'allCasesOptions',
      infectionData : 'infectionData',
    })
  },
};

function initStates(parent){
  let tempStates = [ ...parent.infectionData.states ]
    tempStates.sort(function(a, b){
      return a.name < b.name ? -1 : 1
    })
    tempStates.unshift({BL_ID: 0, name: 'Alle'})
    parent.states = tempStates
  }

</script>

<style>
#zoomer {
  padding-bottom: 50px;
}

button {
  padding: 10px 20px;
  border: 1px solid #ddd;
  color: #333;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  font-size: 14px;
  font-family: '微软雅黑', arail;
  cursor: pointer;
}
v-select {
  cursor: pointer;
}
</style>

<!-- 
GET /settings
Mit GET /settings kann man auf gespeicherte settings zugreifen. Im Request Body werden die
Settings, die benötigt werden übergeben. In der Response, werden dann nur die Settings, deren
Wert in der Request true war zurückgegeben.

Header:
x-guid: string (user ID, das könnte man auch in die URL packen, Ich weiß nicht wie es die andren 
Endpunkte machen)

Request-Body:
{
    zoom: boolean,
    graphs: boolean,
    selected_county: boolean,
    selected_district: boolean,
    selected_metric: boolean,
    selected_table: boolean
}

Response-Body:
{
    zoom?: number,
    graphs?: number,
    selectedCounty?: number,
    selectedDistrict?: number,
    selectedMetric?: 'cases_per_100k' | 'cases7_per_100k',
    selectedTable?: number[][]
}



PUT /settings
Mit PUT /settings kann man settings speichern. Es müssen nicht alle setting werde übergeben werden,
das Backend wird nur die speichern, die tatsächlich teil des Requests war. Die anderen settings
bleiben unverändert.

Header:
x-guid: string (user ID, das könnte man auch in die URL packen, Ich weiß nicht wie es die andren Endpunkte machen)

Response-Body:
{
    zoom?: number,
    graphs?: number,
    selectedCounty?: number,
    selectedDistrict?: number,
    selectedMetric?: 'cases' | 'cases_per_100k' | 'cases7_per_100k',
    selectedTable?: number[][]
}
-->
