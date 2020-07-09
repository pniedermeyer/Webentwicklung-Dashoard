<template>
  <div id="global-options-container">
    <v-card id="d-large" class="w-75 d-none d-md-flex">
      <v-list-item two-line>
        <v-list-item-content>
          <!-- <v-list-item-title class="headline">San Francisco</v-list-item-title>
          <v-list-item-subtitle>Mon, 12:30 PM, Mostly sunny</v-list-item-subtitle>-->
          <div class="d-flex flex-column flex-md-row">
            <v-autocomplete
              v-model="BL_ID"
              :items="states"
              :search-input.sync="searchBL"
              @input="setSelState"
              item-text="name"
              item-value="BL_ID"
              label="Bundesland"
              class="px-3"
              style="width:100%; margin:0px !important; padding"
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
              class="px-3"
              style="width:100%; margin:0px !important"
              return-object
            ></v-autocomplete>
            <v-btn outlined color="primary" class="align-self-center mx-4">
              <span class="d-none d-sm-flex">Find on Map</span>
              <v-icon right class="d-none d-sm-flex">mdi-magnify</v-icon>
              <v-icon class="d-flex d-sm-none">mdi-magnify</v-icon>
            </v-btn>
          </div>
          <div class="d-flex">
            <v-slider
              :max="2"
              :tick-labels="allCasesOptions.map(item => item.label)"
              class="mx-5"
              ticks
              @input="setCaseOption"
            ></v-slider>
            <v-slider
              v-model="resolutionSliderPos"
              :min="-3"
              :max="0"
              @input="setMapResolution"
              :tick-labels="this.mapResolutions"
              class="mx-5 d-none d-md-flex"
              ticks
            ></v-slider>
            <div class="d-flex flex-column d-md-none w-50">
              <v-slider
                v-model="resolutionSliderPos"
                :min="-3"
                :max="0"
                @input="setMapResolution"
                class="mx-2"
                ticks
              ></v-slider>
              <span class="d-flex">Text</span>
            </div>
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
    <v-card id="d-small" class="w-100 d-flex d-md-none">Test</v-card>
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
    resolutionSliderPos: -3,
    states: [{ BL_ID: 0, name: "Alle" }],
    mapResolutions: ["Low", "Medium", "High", "Original"],
    casesOptions: ["Alle", "100K", "100K / 7 Tage"],
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
      console.log(this.casesOptions);
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
    setMapResolution(value) {
      value++;
      if (value > 0) {
        value = 0;
      }
      this.mapResolution = Math.abs(value);
    },
    setCaseOption(caseOption) {
      this.casesOption = this.allCasesOptions[caseOption].code;
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
    }
  },
  mounted() {
    initStates(this);
    this.selectCountiesToState(this.BL_ID);
    // this.states = this.infectionData.states
  },
  computed: {
    ...mapFields({
      BL_ID: "BL_ID",
      LK_ID: "LK_ID",
      casesOption: "casesOption",
      allCasesOptions: "allCasesOptions",
      infectionData: "infectionData",
      mapResolution: "mapResolution"
    })
  }
};

function initStates(parent) {
  let tempStates = [...parent.infectionData.states];
  tempStates.sort(function(a, b) {
    return a.name < b.name ? -1 : 1;
  });
  tempStates.unshift({ BL_ID: 0, name: "Alle" });
  parent.states = tempStates;
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

#d-large {
  position: absolute;
  bottom: 2%;
  left: 12.5%;
  z-index: 1001;
  width: 75%;
}

#d-small {
  position: absolute;
  bottom: 2%;
  z-index: 1001;
  width: 100%;
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
    selected_county: boolean,
    selected_district: boolean,
    selected_metric: boolean,
    selected_table: boolean
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
