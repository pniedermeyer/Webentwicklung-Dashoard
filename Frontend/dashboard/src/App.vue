<template>
  <div id="app">
    <bar-chart :chartData="arrTotal" :options="chartOptions" :label="Test"></bar-chart> 

    <grid-layout
                    :layout.sync="layout"
                    :col-num="12"
                    :row-height="30"
                    :is-draggable="true"
                    :is-resizable="true"
                    :vertical-compact="true"
                    :margin="[10, 10]"
                    :use-css-transforms="true"
    >

            <grid-item v-for="item in layout"
                                  :x.sync="item.x"
                                  :y.sync="item.y"
                                  :w.sync="item.w"
                                  :h.sync="item.h"
                                  :i="item.i"
                                  :key="item.i">
                    {{item.i}}
            </grid-item>
    </grid-layout>
  </div> 
</template>

<script src="vue-grid-layout.umd.min.js"></script>
<script>
import VueGridLayout from 'vue-grid-layout';
import Vue from 'vue' // es6 syntax
import Test from './components/Test.vue'
// import BarChart from './components/Barchart.vue'
import BarChart from './components/BarchartTest.vue'

var testLayout = [
    {"x":0,"y":0,"w":2,"h":2,"i":"0"},
    {"x":2,"y":0,"w":2,"h":4,"i":"1"},
    {"x":4,"y":0,"w":2,"h":5,"i":"2"},
    {"x":6,"y":0,"w":2,"h":3,"i":"3"},
    {"x":8,"y":0,"w":2,"h":3,"i":"4"},
    {"x":10,"y":0,"w":2,"h":3,"i":"5"}
];

export default {
  name: 'App',
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    BarChart
  },
  data () {
    return {
      Test: 'Cases100k',
      layout: testLayout,
      arrTotal: [10,15,20],
      arrCounty: ['Saarbrücken', 'Saarlouise', 'Merzig'],
      chartOptions: {
            scales: {
        xAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    },
        responsive: true,
        maintainAspectRatio: false,

      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
