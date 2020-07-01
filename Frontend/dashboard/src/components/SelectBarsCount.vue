<template>
<div>
 <p>📊Wie viele Graphen?</p>
<!--   <v-number-input v-model="value" :min="1" :max="10" inline controls @change="change"></v-number-input>   -->
  <v-number-input v-model= "graphsShown"  :min="1" :max="10" inline controls ></v-number-input>  
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
    computed: {
    ...mapFields([
      'graphsShown'
    ]),
  },
}

</script>