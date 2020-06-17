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
        this.$emit('updateSelectedBL', value)
        console.log(value)  
      }
    },
    mounted(){
      console.log(this.selectedID)
      this.items = this.data.states
      this.selected = this.data.states.find(element => element.BL_ID == this.selectedID)
    }
}

</script>

