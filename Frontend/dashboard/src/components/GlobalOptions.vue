<template>
  <div id="global-options-container">
    <v-card class="w-75">
      <v-list-item two-line>
        <v-list-item-content>
          <!-- <v-list-item-title class="headline">San Francisco</v-list-item-title>
          <v-list-item-subtitle>Mon, 12:30 PM, Mostly sunny</v-list-item-subtitle>-->
          <div class="d-flex">
            <v-autocomplete
              v-model="BL_ID"
              :items="states"
              :search-input.sync="searchBL"
              @input="setSelState"
              item-text="name"
              item-value="BL_ID"
              label="Bundesland"
              class="mx-3"
              style="width:2%"
            ></v-autocomplete>
            <v-autocomplete
              v-model="LK_ID"
              :items="counties"
              @input="setSelCounty"
              hide-no-data
              hide-selected
              item-text="LK"
              item-value="LK_ID"
              label="Landkreis"
              class="mx-3"
              style="width:2%"
              return-object
            ></v-autocomplete>
            <v-btn outlined color="primary" class="align-self-center mx-4">
              <span>Find on Map</span>
              <v-icon right>mdi-magnify</v-icon>
            </v-btn>
          </div>
          <div>
            <v-slider :max="3" :tick-labels="mapResolutions" class="mx-5" ticks></v-slider>
          </div>
        </v-list-item-content>
      </v-list-item>

      <!-- <v-card-text>
        <v-row align="center">
          <v-col class="display-3" cols="6">23&deg;C</v-col>
          <v-col cols="6">
            <v-img
              src="https://cdn.vuetifyjs.com/images/cards/sun.png"
              alt="Sunny image"
              width="92"
            ></v-img>
          </v-col>
        </v-row>
      </v-card-text>-->
    </v-card>
    <!-- <div>
      <div id="zoomer">
        <h1>Auflösung</h1>
        <v-slider
          v-model="zoomstufe"
          v-bind="zoomsliderOptions"
          :data="['basycs', 'etwas Wilder', 'Zu Wild', '10/10']"
        ></v-slider>
      </div>
      <h1>🗺️Bundesland</h1>
      <v-select
        v-model="BL_ID"
        label="name"
        :options="states"
        :reduce="(item) => item.BL_ID"
        @input="setSelState"
        :clearable="false"
      ></v-select>
    </div>
    <div>
      <h1>🗾Landkreis</h1>
      <v-select
        v-model="LK_ID"
        label="LK"
        :options="counties"
        :reduce="(item) => item.LK_ID"
        :clearable="false"
        @input="setSelCounty"
      ></v-select>
    </div>
    <div>
      <h1>💯Fallzahlen</h1>
      <v-select
        v-model="casesOption"
        :options="allCasesOptions"
        :reduce="(option) => option.code"
        :clearable="false"
      ></v-select>
    </div>
    <div>
      <button v-on:click="saveUserSettings()">💾Einstellungen speichern</button>
    </div>-->
  </div>
</template>

<script>
import { mapFields } from "vuex-map-fields";

export default {
  data: () => ({
    states: [{ BL_ID: 0, name: "Alle" }],
    mapResolutions: ["Low", "Medium", "High", "Original"],
    selectedState: null,
    counties: [""],
    selectedCounty: null,
    zoomstufe: "",
    searchBL: "",
    zoomsliderOptions: {
      min: 0,
      interval: 1,
      max: 3,
      marks: true
    }
  }),
  methods: {
    setSelState(value) {
      this.LK_ID = null;
      // this.BL_ID = value;
      this.selectCountiesToState(value);
    },
    setSelCounty(value) {
      this.LK_ID = value.LK_ID;
      this.BL_ID = value.BL_ID;
      // if (!this.BL_ID) {
      //   this.BL_ID = this.counties.find(e => e.LK_ID === value).BL_ID;
        this.selectCountiesToState(this.BL_ID);
      // }
    },
    selectCountiesToState(stateId) {
      if (stateId != 0) {
        let state = this.states.find(state => state.BL_ID === stateId);
        let tempCounties = state.counties;
        tempCounties.sort(function(a, b) {
          return a.LK < b.LK ? -1 : 1;
        });
        this.counties = tempCounties;
      } else {
        let tempCounties = [];
        for (let i = 1; i < this.states.length; i++)
          this.states[i].counties.forEach(county => {
            county.BL_ID = this.states[i].BL_ID;
            tempCounties.push(county);
          });
        tempCounties.sort(function(a, b) {
          return a.LK < b.LK ? -1 : 1;
        });
        this.counties = tempCounties;
      }
      this.selectedCounty = null;
    },
    saveUserSettings() {
      //Hier Settings speichern!
      console.log("Jetzt könnten wir speichern!");
    }
  },
  watch: {
    infectionData: function() {
      initStates(this);
      this.selectCountiesToState(this.BL_ID);
    },
    BL_ID: function() {
      initStates(this);
      this.selectCountiesToState(this.BL_ID);
    }
  },
  mounted() {
    initStates(this);
    this.selectCountiesToState(this.BL_ID);
  },
  computed: {
    ...mapFields({
      BL_ID: "BL_ID",
      LK_ID: "LK_ID",
      casesOption: "casesOption",
      allCasesOptions: "allCasesOptions",
      infectionData: "infectionData"
    })
  }
};

function initStates(parent) {
  try{
    let tempStates = [...parent.infectionData.states];
    tempStates.sort(function(a, b) {
      return a.name < b.name ? -1 : 1;
    });
    tempStates.unshift({ BL_ID: 0, name: "Alle" });
    parent.states = tempStates;
  }catch(e){
    if(e instanceof TypeError){
      //Is trown when the async loaded data is not yet finished loading. No real Error

      // console.log(e)
    }else{
      console.error(e)
    }
  }
}
</script>

<style scoped>
#zoomer {
  padding-bottom: 50px;
}

button {
  padding: 10px 20px;
  border: 1px solid #ddd;
  color: #333;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  font-size: 14px;
  font-family: "微软雅黑", arail;
  cursor: pointer;
}
v-select {
  cursor: pointer;
}

#global-options-container {
  position: absolute;
  bottom: 2%;
  left: 25%;
  z-index: 1001;
  width: 75%;
}
</style>

<!-- 
GET /settings
Mit GET /settings kann man auf gespeicherte settings zugreifen. Im Request Body werden die
Settings, die benötigt werden übergeben. In der Response, werden dann nur die Settings, deren
Wert in der Request true war zurückgegeben.

Header:
x-guid: string (user ID, das könnte man auch in die URL packen, Ich weiß nicht wie es die andren 
Endpunkte machen)

Request-Body:
{
    zoom: boolean,
    graphs: boolean,
    selectedCounty: boolean,
    selectedDistrict: boolean,
    selectedMetric: boolean,
    selectedTable: boolean
}

Response-Body:
{
    zoom?: number,
    graphs?: number,
    selectedCounty?: number,
    selectedDistrict?: number,
    selectedMetric?: 'cases_per_100k' | 'cases7_per_100k',
    selectedTable?: number[][]
}



PUT /settings
Mit PUT /settings kann man settings speichern. Es müssen nicht alle setting werde übergeben werden,
das Backend wird nur die speichern, die tatsächlich teil des Requests war. Die anderen settings
bleiben unverändert.

Header:
x-guid: string (user ID, das könnte man auch in die URL packen, Ich weiß nicht wie es die andren Endpunkte machen)

Response-Body:
{
    zoom?: number,
    graphs?: number,
    selectedCounty?: number,
    selectedDistrict?: number,
    selectedMetric?: 'cases' | 'cases_per_100k' | 'cases7_per_100k',
    selectedTable?: number[][]
}
-->
