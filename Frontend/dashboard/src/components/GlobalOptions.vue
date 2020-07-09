<template>
  <div>
    <div>
      <h1>🗺️Bundesland</h1>
      <v-select label="name" :options="states" :reduce="item => item.BL_ID" :value="selectedState" @input="setSelState" :clearable="false"></v-select>
    </div>
    <div>
      <h1>🗾Landkreis</h1>
      <v-select label="LK" :options="counties" :reduce="item => item.LK_ID" :value="selectedCounty" @input="setSelCounty" :clearable="false"></v-select>
    </div>
    <div>
      <h1>💯Fallzahlen</h1>
      <v-select :options="caseOptions" :reduce="option => option.code" :value="selectedCaseOption" @input="setCasesOption" :clearable="false"></v-select>
    </div>
    <div>
        <button v-on:click="saveUserSettings()">💾Einstellungen speichern</button>
    </div>  
  </div>
</template>


<script>
//import Vue from 'vue'
//import vSelect from 'vue-select'

export default {
    data: () => ({
      states: [""],
      selectedState: null,
      counties: [""],
      selectedCounty: null
    }),
    props: {
      infectionData: {
        type: Object
      },
      selectedBLID: {
        type: Number
      },
      selectedLKID: {
        type: Number
      },
      selectedCaseOption: {
        type: String
      },
      caseOptions: {
        type: Array
      },
    },
    methods: {
      setSelState(value) {
        this.selectedState = value
        this.$emit('updateSelectedBL', value)
        this.selectCountiesToState(value)
        console.log('BL-ID: ' + value) 
      },
      setSelCounty(value) {
        this.selectedCounty = value
        this.$emit('updateSelectedLK', value)
        console.log('LK-ID: ' + value) 
      },
      selectCountiesToState(stateId){
        if(stateId){
          let state = this.states.find(state => state.BL_ID === stateId)
          this.counties = state.counties
        }else{
          this.counties = [""]
        }
        this.selectedCounty = null
      },
      setCasesOption(value){
        // this.selectedCaseOption = value
        this.$emit('updateCaseOptions', value)
        console.log('Cases option: ' + value)
      },
      saveUserSettings() {
        //Hier Settings speichern!
        console.log("Jetzt könnten wir speichern!")
      }
    },
    watch: { 
      selectedBLID: function(val) {
        if(val !== this.selectedState){
          this.setSelState(val)
        }
      },
      selectedLKID: function(val) {
        if(val !== this.selectedCounty){
          this.setSelCounty(val)
        }
      },
      infectionData: function() {
        this.states = this.infectionData.states
      }
    },
    mounted(){
      this.states = this.infectionData.states
    }
}

</script>

<style >
button {
  padding: 10px 20px;
  border: 1px solid #ddd;
  color: #333;
  background-color:rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  font-size: 14px;
  font-family: '微软雅黑',arail;
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
    selectedCounty: boolean,
    selectedDistrict: boolean,
    selectedMetric: boolean,
    selectedTable: boolean
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