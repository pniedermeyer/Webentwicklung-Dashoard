<template>
  <div>
    <div>
      <h1>Bundesland</h1>
      <v-select label="name" :options="states" :reduce="item => item.BL_ID" :value="selectedState" @input="setSelState"></v-select>
    </div>
    <div>
      <h1>Landkreis</h1>
      <v-select label="LK" :options="counties" :reduce="item => item.LK_ID" :value="selectedCounty" @input="setSelCounty"></v-select>
    </div>
    <div>
      <h1>Fallzahlen</h1>
      <v-select label="cases" ></v-select>
    </div>
  </div>
</template>


<script>
//import Vue from 'vue'
//import vSelect from 'vue-select'

export default {
    data: () => ({
      states: [""],
      counties: [""],
      selectedState: 0,
      selectedCounty: 0,
    }),
    props: {
      data: {
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
          let state = this.data.states.find(state => state.BL_ID === stateId)
          this.counties = state.counties
        }else{
          this.counties = [""]
        }
        this.selectedCounty = null
      },
    },
    watch: { 
      selectedBLID: function() {
        updateData(this)
      },
      selectedLKID: function() {
        updateData(this)
      }
    },
    mounted(){
      this.states = this.data.states
      updateData(this)
    }
}

function updateData(parent){
  parent.counties = parent.data.states.find(state => state.BL_ID === parent.selectedBLID).counties
  parent.selectedState = parent.data.states.find(state => state.BL_ID === parent.selectedBLID)
  parent.selectedCounty = parent.selectedState.counties.find(county => county.LK_ID === parent.selectedLKID)
}

</script>

