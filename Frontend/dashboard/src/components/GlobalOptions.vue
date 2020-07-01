<template>
  <div>
    <div>
      <h1>🗺️Bundesland</h1>
      <v-select
        v-model="selectedBL_ID"
        label="name"
        :options="states"
        :reduce="(item) => item.BL_ID"
        @input="setSelState"
        :clearable="false"
      ></v-select>
    </div>
    <div>
      <h1>🗾Landkreis</h1>
      <v-select v-model="selectedLK_ID" label="LK" :options="counties" :reduce="(item) => item.LK_ID" :clearable="false"></v-select>
    </div>
    <div>
      <h1>💯Fallzahlen</h1>
      <v-select v-model="selectedCaseOptions" :options="caseOptions" :reduce="(option) => option.code" :clearable="false"></v-select>
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
    states: [''],
    selectedState: null,
    counties: [''],
    selectedCounty: null,
  }),
  props: {
    infectionData: {
      type: Object,
    },
    caseOptions: {
      type: Array,
    },
  },
  methods: {
    setSelState(value) {
      this.selectedLK_ID = null
      // this.selectedState = value
      this.selectCountiesToState(value)
      console.log('BL-ID: ' + value)
    },
    selectCountiesToState(stateId) {
      if (stateId) {
        let state = this.states.find((state) => state.BL_ID === stateId)
        this.counties = state.counties
      } else {
        this.counties = ['']
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
      this.states = this.infectionData.states
    },
  },
  mounted() {
    this.states = this.infectionData.states
  },
  computed: {
    ...mapFields(['selectedBL_ID', 'selectedLK_ID', 'selectedCaseOptions']),
  },
}
</script>

<style>
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
