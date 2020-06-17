<template>
  <div>
    <h1>Bundeslandauswahl</h1>
    <v-select label="name" :options="items" :reduce="item => item.BL_ID" :value="selected" @input="setSelected"></v-select>
  </div>
</template>


<script>
//import Vue from 'vue'
//import vSelect from 'vue-select'

export default {
    data: () => ({
      items: [""],
      selected: 0,
    }),
    props: {
      data: {
        type: Object
      },
      selectedID: {
        type: Number
      }
    },
    methods: {
      setSelected(value) {
        this.selected = value
        this.$emit('updateSelectedBL', value)
        console.log(value)  
      }
    },
    watch: { 
      selectedID: function() {
        updateData(this)
      },
    },
    mounted(){
      this.items = this.data.states
      updateData(this)
    }
}

function updateData(parent){
  parent.selected = parent.data.states.find(element => element.BL_ID == parent.selectedID)
}

</script>

