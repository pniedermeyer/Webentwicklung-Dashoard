<template>
  <div>
    <div>
      <h1>Bundesland</h1>
      <v-select label="name" :options="states" :reduce="item => item.BL_ID" :value="selectedState" @input="setSelState" :clearable="false"></v-select>
    </div>
    <div>
      <h1>Landkreis</h1>
      <v-select label="LK" :options="counties" :reduce="item => item.LK_ID" :value="selectedCounty" @input="setSelCounty" :clearable="false"></v-select>
    </div>
    <div>
      <h1>Fallzahlen</h1>
      <v-select :options="caseOptions" :reduce="option => option.code" :value="selectedCaseOption" @input="setCasesOption" :clearable="false"></v-select>
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
      selectedCounty: null,
      caseOptions: [
        { label: "Alle Fälle", code: "cases"},
        { label: "Fälle / 100k", code: "cases_per_100k" },
        { label: "Fälle / 100k letzte 7 Tage", code: "cases7_per_100k"},
      ],
      selectedCaseOption: "cases"
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
      }
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
        this.selectedCaseOption = value
        this.$emit('updateCasesOption', value)
        console.log('Cases option: ' + value)
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

