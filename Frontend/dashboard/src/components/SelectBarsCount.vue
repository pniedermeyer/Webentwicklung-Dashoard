<template>
<div>
 <p>Wie viele Graphen? {{value}}</p>
  <v-number-input v-model="value" :min="1" :max="10" inline controls @change="change"></v-number-input>  
</div>
</template>

<script>
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

    }
}

</script>