<template>
<div>
    <b-card no-body>
      <b-tabs card>
        <b-tab title="Fälle">
          <b-container class="bv-example-row">
            <b-row>
              <b-col>
                <p>Fälle</p>
                {{this.data.cases}}
              </b-col>
              <b-col>
                <p>Fälle per 100k</p>
                {{this.data.cases100k}}
              </b-col>
              <b-col>
                <p>Fälle per 100k letze 7 Tage</p>
                {{this.data.cases100k7}}
              </b-col>
              <b-col>
                <LineChart :data="this.data.casesArr" :label="'Fälle gesamt'" v-on:lineclick="doSomething"></LineChart>
              </b-col>
            </b-row>
            <b-row>
              {{this.data.name}}
            </b-row>
          </b-container>
        </b-tab>
        <b-tab title="Vergleich">
          <b-container class="bv-example-row">
            <b-row>
              <b-col>
                <p>Neuinfektionen</p>
                {{this.data.newInfections}}
              </b-col>
              <b-col>
                <LineChart :data="this.data.newInfectionsArr" :label="'Tägiche Neuinfektionen'" v-on:lineclick="doSomething"></LineChart>
              </b-col>
            </b-row>
            <b-row>
              {{this.data.name}}
            </b-row>
          </b-container>
        </b-tab>
        <b-tab title="Tote">
          <b-container class="bv-example-row">
            <b-row>
              {{"Tote: " + this.data.deaths}}
            </b-row>
            <b-row>
              {{this.data.name}}
            </b-row>
          </b-container>
        </b-tab>
      </b-tabs>
    </b-card>

    



  </div>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import LineChart from "./LineChart.vue"

export default {
  name: "Details",
  components: {
    LineChart
  },
  data() {
    return {
      data:{
        name : "",
        cases : "",
        cases100k : "",
        cases100k7 : "",
        newInfections : "",
        deaths : "",
        casesArr : [],
        newInfectionsArr : []
      },
      dialog: this.lineChartDialogConfig //Change on click event
    }
  },
  props: {
    view: Number
  },
  mounted() {
    fillData(this)
  },
  watch: {
    BL_ID: function() {
      fillData(this)
    },
    LK_ID: function() {
      fillData(this)
    },
    infectionData: function() {
      fillData(this)
    },
    // lineChartDialogConfig: function() {
    //   console.log("oainf")
    //   this.dialog = true
    // },
  },
  computed: {
    ...mapFields({
      BL_ID: "BL_ID",
      LK_ID: "LK_ID",
      infectionData: "infectionData",
      lineChartDialogConfig: 'lineChartDialogConfig'  
    })
  },
  methods: {
    doSomething: function(value) {
      //console.log(value);
      this.lineChartDialogConfig = {
        label: value.label + " - " + this.data.name,
        data: value.data,
        shown: true}
      this.dialog = true
      // return ""
    }
  }

};

function fillData(parent){
  if(parent.infectionData){
    switch(parent.view) {
      case 0:
      //Deutschand view
      parent.data = {
        name : parent.infectionData.name,
        cases : parent.infectionData.cases_DE,
        cases100k : Math.round(parent.infectionData.cases_per_100k_DE * 100) / 100,
        cases100k7 : Math.round(parent.infectionData.cases7_per_100k_DE * 100) / 100,
        newInfections : parent.infectionData.new_cases_DE,
        deaths : parent.infectionData.deaths_DE,
        casesArr : parent.infectionData.cases_Arr ? parent.infectionData.cases_Arr : [1,1,2,3,5,8],
        newInfectionsArr : parent.infectionData.newInfections_Arr ? parent.infectionData.newInfections_Arr : [4,5,9,7,1,3]
      }
      break;
      case 1:
      //BL view
        if(parent.BL_ID){
          let BLdata = parent.infectionData.states.find(e => e.BL_ID === parent.BL_ID)

          parent.data = {
            name : BLdata.name,
            cases : BLdata.cases_BL,
            cases100k : Math.round(BLdata.cases_per_100k_BL * 100) / 100,
            cases100k7 : Math.round(BLdata.cases7_per_100k_BL * 100) / 100,
            newInfections : BLdata.new_cases_BL,
            deaths : BLdata.deaths_BL,
            casesArr : BLdata.cases_Arr ? BLdata.cases_Arr : [4,7,9,1,3,5],
            newInfectionsArr : BLdata.newInfections_Arr ? BLdata.newInfections_Arr : [1,2,6,4,7,9]
          }
        }else{
          empty(parent);
        }
      break;
      case 2:
      //LK view
      if(parent.BL_ID && parent.LK_ID){
        let LKdata = parent.infectionData.states.find(e => e.BL_ID === parent.BL_ID).counties.find(ee => ee.LK_ID === parent.LK_ID)

        parent.data = {
          name : LKdata.LK,
          cases : LKdata.cases_LK,
          cases100k : Math.round(LKdata.cases_per_100k_LK * 100) / 100,
          cases100k7 : Math.round(LKdata.cases7_per_100k_LK * 100) / 100,
          newInfections : LKdata.new_cases_LK,
          deaths : LKdata.deaths_LK,
          casesArr : LKdata.cases_Arr ? LKdata.cases_Arr : [1,1,1,2,2,8],
          newInfectionsArr : LKdata.newInfections_Arr ? LKdata.newInfections_Arr : [1,2,3,4,5,6]
        }
      }else{
        empty(parent)
      }
      break;
      default:
        empty(parent)
    }
  }else{
        empty(parent)
      }
}

function empty (parent){
  parent.data = {
          name : "",
          cases : "",
          cases100k : "",
          cases100k7 : "",
          newInfections : "",
          deaths : ""
        }
}

</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>