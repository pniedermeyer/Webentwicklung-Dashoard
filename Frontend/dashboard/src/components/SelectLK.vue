<template>
<div>
    <h1>Landkreisauswahl</h1>
   <v-select label="LK" :options="items" :reduce="item => item.LK_ID" :value="selected" @input="setSelected"></v-select>
</div>
</template>


<script>
//import Vue from 'vue'
//import vSelect from 'vue-select'

export default {
    data: () => ({
      items: [""],
      selected: "",
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
      setSelected(value) {
        this.selected=value
        this.$emit('updateSelectedLK', value)
      }
    },
    mounted(){
      console.log(this.selected)
      updateData(this);
    },
    watch: { 
      selectedBLID: function() {
        updateData(this)
      },
      selectedLKID: function() {
        updateData(this)
      }
    }
}

function updateData(parent){
  parent.items = parent.data.states.find(element => element.BL_ID == parent.selectedBLID).counties
  parent.selected = parent.items.find(element => element.LK_ID == parent.selectedLKID)
}

</script>

