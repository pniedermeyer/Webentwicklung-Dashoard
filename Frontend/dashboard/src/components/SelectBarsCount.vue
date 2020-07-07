<template>
<div>
 <p>📊Wie viele Graphen?</p>
  <v-number-input v-model= "barsShown"  :min="1" :max="10" inline controls ></v-number-input>  
</div>
</template>

<script>
import { mapFields } from 'vuex-map-fields';

export default {
    computed: {
    ...mapFields([
      'barsShown'
    ]),
  },
}

</script>