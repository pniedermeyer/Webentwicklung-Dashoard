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
      selected: 0,
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
        this.$emit('updateSelectedBL', value)
        console.log(value)  
      }
    },
    mounted(){
      updateData(this);
    },
    watch: { 
      selectedBLID: function() {
        updateData(this)
      }
    }
}

function updateData(parent){
  parent.items = parent.data.states.find(element => element.BL_ID == parent.selectedBLID).counties
  parent.selected = parent.items.find(element => element.LK_ID == parent.selectedLK_ID)
}

</script>

