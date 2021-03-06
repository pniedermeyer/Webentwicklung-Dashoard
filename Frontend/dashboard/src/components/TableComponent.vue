<template>
  <div>
    <b-card no-body>
      <b-tabs card>
        <v-multiselect
          :multiple="true"
          label="name"
          :options="views.filter(element => element.correspondingTo <= tableTab)"
          group-values="options"
          group-label="focus"
          :value="selectedItems[tableTab]"
          @select="addOption"
          @remove="removeOption"
          :close-on-select="false"
          :clear-on-select="false"
          :preserve-search="true"
          placeholder="Wählen Sie ihre Inhalte aus:"
        >
          <template slot="selection" slot-scope="{ values, search, isOpen }">
            <span
              class="multiselect__single"
              v-if="values.length &amp;&amp; !isOpen"
            >{{ values.length }} Tabelleninhalte ausgewählt</span>
          </template>
        </v-multiselect>

        <b-table striped hover :items="items"></b-table>

        <b-tab title="Deutschland" @click="changeTab(0)"></b-tab>
        <b-tab title="Bundesland" @click="changeTab(1)" :disabled="BL_ID?false:true"></b-tab>
        <b-tab title="Landkreis" @click="changeTab(2)" :disabled="LK_ID?false:true"></b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import { mapFields } from "vuex-map-fields";

export default {
  name: "infectionTable",
  data() {
    return {
      // tab:0,
      tabitems: [
        { tableTab: "One", content: "Deutschland" },
        { tableTab: "Two", content: "Bundesland" },
        { tableTab: "Three", content: "Landkreis" }
      ],
      items: [],
      views: views,
      selectedItems: [[], [], []],
      infectionDataBL: {},
      infectionDataLK: {}
    };
  },
  mounted() {
    startup(this);
    mountSelected(this);
    fillItems(this);
  },
  methods: {
    addOption(element) {
      this.selectedItems[this.tableTab].push(element);
      this.selectedItems[this.tableTab].sort((a, b) => (a.id < b.id ? -1 : 0));

      this.tableSelectedItemsID[this.tableTab].push(element.id);
      this.tableSelectedItemsID[this.tableTab].sort((a, b) => (a < b ? -1 : 0));

      fillItems(this);

      this.$emit("addOption", this.tableSelectedItemsID);
    },
    removeOption(element) {
      this.selectedItems[this.tableTab].splice(
        this.selectedItems[this.tableTab].findIndex(o => o === element),
        1
      );

      this.tableSelectedItemsID[this.tableTab].splice(
        this.selectedItems[this.tableTab].findIndex(o => o === element.id),
        1
      );

      fillItems(this);
      this.$emit("removeOption", this.tableSelectedItemsID);
    },
    changeTab(tableTab) {
      this.tableTab = tableTab;
      fillItems(this);
      this.$emit("changeTab", this.tableTab);
    },
    test(e) {
      console.log(e);
    }
  },
  watch: {
    BL_ID: function() {
      if (this.tableTab === 2) {
        this.changeTab(0);
      }
      startup(this);
    },
    LK_ID: function() {
      startup(this);
    },
    infectionData: function() {
      this.states = this.infectionData.states;
    }
  },
  computed: {
    ...mapFields({
      BL_ID: "BL_ID",
      LK_ID: "LK_ID",
      casesOption: "casesOption",
      infectionData: "infectionData",
      tableSelectedItemsID: "tableSelectedItemsID",
      tableTab: "tableTab"
    })
  }
};

function startup(parent) {
  parent.infectionDataBL = parent.BL_ID
    ? parent.infectionData.states.find(e => e.BL_ID === parent.BL_ID)
    : {};
  parent.infectionDataLK = parent.LK_ID
    ? parent.infectionDataBL.counties.find(e => e.LK_ID === parent.LK_ID)
    : {};

  fillItems(parent);
}

const views = [
  {
    focus: "Deutschland",
    correspondingTo: 0,
    options: [
      { id: 0, name: "Name des Landes", label: "Land" },
      { id: 2, name: "Infektionen des Landes", label: "Infektionen nat." },
      { id: 4, name: "Anzahl Tote des Landes", label: "Tote nat." },
      {
        id: 6,
        name: "Infektionen pro 100k des Landes",
        label: "Infektionen nat. pro 100k "
      },
      {
        id: 8,
        name: "Infektionen der letzen 7 Tage pro 100k des landes",
        label: "Infekt. nat. letze 7 Tage/100k"
      },
      { id: 10, name: "Genesene des Landes", label: "Genesene nat." },
      {
        id: 12,
        name: "Vergleich zu vorherigem Tag des Landes",
        label: "Vergleich Tag zuvor nat."
      }
    ]
  },
  {
    focus: "Bundesland",
    correspondingTo: 1,
    options: [
      { id: 20, name: "Name des BL", label: "BL" },
      { id: 22, name: "Infektionen des BL", label: "Infektionen bl." },
      { id: 24, name: "Anzahl Tote des BL", label: "Tote bl." },
      {
        id: 26,
        name: "Infektionen pro 100k des BL",
        label: "Infektionen bl. pro 100k "
      },
      {
        id: 28,
        name: "Infektionen der letzen 7 Tage pro 100k des landes",
        label: "Infekt. bl. letze 7 Tage/100k"
      },
      { id: 30, name: "Genesene des BL", label: "Genesene bl." },
      {
        id: 32,
        name: "Vergleich zu vorherigem Tag des BL",
        label: "Vergleich Tag zuvor bl."
      }
    ]
  },
  {
    focus: "Landkreis",
    correspondingTo: 2,
    options: [
      { id: 40, name: "Name des Landkreises", label: "LK" },
      { id: 42, name: "Infektionen des Landkreises", label: "Infektionen LK" },
      { id: 44, name: "Anzahl Tote des Landkreises", label: "Tote LK" },
      {
        id: 46,
        name: "Infektionen pro 100k des Landkreises",
        label: "Infektionen LK pro 100k "
      },
      {
        id: 48,
        name: "Infektionen der letzen 7 Tage pro 100k des Landkreises",
        label: "Infekt. LK letze 7 Tage/100k"
      },
      { id: 50, name: "Genesene des Landkreises", label: "Genesene LK" },
      {
        id: 52,
        name: "Vergleich zu vorherigem Tag des Landkreises",
        label: "Vergleich Tag zuvor LK"
      }
    ]
  }
];

function mountSelected(parent) {
  parent.tableSelectedItemsID.forEach((view, i) => {
    view.forEach(selectedID => {
      parent.selectedItems[i].push(findView(selectedID, parent));
    });
  });
}

function findView(id, parent) {
  for (const i in parent.views) {
    for (const j in parent.views[i].options) {
      if (parent.views[i].options[j].id === id) {
        return parent.views[i].options[j];
      }
    }
  }
}

function fillItems(parent) {
  parent.items = [];
  parent.selectedItems[parent.tableTab].forEach(selectedItem => {
    parent.items.push({
      label: selectedItem.name,
      value: getDatatoID(parent, selectedItem.id)
    });
  });
}

function getDatatoID(parent, id = -1) {
  switch (id) {
    case 0:
      return parent.infectionData.name;
    case 2:
      return parent.infectionData.cases_DE;
    case 4:
      return parent.infectionData.deaths_DE;
    case 6:
      return Math.round(parent.infectionData.cases_per_100k_DE * 100) / 100;
    case 8:
      return Math.round(parent.infectionData.cases7_per_100k_DE * 100) / 100;
    case 10:
      return parent.infectionData.recovered_DE;
    case 12:
      return parent.infectionData.change_DE;

    case 20:
      return parent.infectionDataBL.name;
    case 22:
      return parent.infectionDataBL.cases_BL;
    case 24:
      return parent.infectionDataBL.deaths_BL;
    case 26:
      return Math.round(parent.infectionDataBL.cases_per_100k_BL * 100) / 100;
    case 28:
      return Math.round(parent.infectionDataBL.cases7_per_100k_BL * 100) / 100;
    case 30:
      return parent.infectionDataBL.recovered_BL;
    case 32:
      return parent.infectionDataBL.change_BL;

    case 40:
      return parent.infectionDataLK.LK;
    case 42:
      return parent.infectionDataLK.cases_LK;
    case 44:
      return parent.infectionDataLK.deaths_LK;
    case 46:
      return Math.round(parent.infectionDataLK.cases_per_100k_LK * 100) / 100;
    case 48:
      return Math.round(parent.infectionDataLK.cases7_per_100k_LK * 100) / 100;
    case 50:
      return parent.infectionDataLK.recovered_LK;
    case 52:
      return parent.infectionDataLK.change_LK;
    default:
      return "";
  }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
