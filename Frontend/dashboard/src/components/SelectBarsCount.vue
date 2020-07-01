<template>
<div>
 <p>📊Wie viele Graphen? {{value}}</p>
<!--   <v-number-input v-model="value" :min="1" :max="10" inline controls @change="change"></v-number-input>   -->
  <v-number-input v-model= "graphsShown"  :min="1" :max="10" inline controls @change="change"></v-number-input>  
</div>
</template>

<script>
import { mapFields } from 'vuex-map-fields';

export default {
    data() {
      return {
        value: 3,
      }
    },
    methods: {
        change () {
            //Hier change event triggern!!
           this.$emit('updateGraphsShown', this.value)
           //console.log("graphs shown: "+this.value)
        }

    },
    // computed: {
    //   count: {
    //     get () {
    //       return this.$store.state.count
    //     },
    //     set (value) {
    //       this.$store.commit('updateCount', value)
    //     }
    //   }
    // }
    computed: {
    // The `mapFields` function takes an array of
    // field names and generates corresponding
    // computed properties with getter and setter
    // functions for accessing the Vuex store.
    ...mapFields([
      'graphsShown'
    ]),
  },
}

</script>