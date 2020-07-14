<script>
import { Line } from "vue-chartjs";
import { mapFields } from "vuex-map-fields";
export default {
  extends: Line,
  name: "linechart",
  data: () => ({}),
  props: {
    data: Array,
    label: String,
    labelShown: {
      type: Boolean,
      default: false
    },
    dates: Array
  },
  mounted() {
    drawLineChart(this);
  },
  methods: {
    handle: function() {
      // this.lineChartDialogConfig = 'GEÄNDERT'
      this.$emit("lineclick", this);
    }
  },
  computed: {
    ...mapFields({
      casesOption: "casesOption",
      infectionData: "infectionData",
      lastXDays: "lastXDays",
      lineChartDialogConfig: "lineChartDialogConfig",
      pastInfectionData: "pastInfectionData"
    })
  },
  watch: {
    data: function() {
      drawLineChart(this);
    },
    label: function() {
      drawLineChart(this);
    }
  }
};

function drawLineChart(parent) {
  const chartOptions = {
    scales: {
      yAxes: [
        {
          ticks: {
            //Sagt aus, dass an der Y-Achse immer mindestens integer abstand ist (sonst haben wir komma stellen)
            stepSize: 1
          }
        }
      ]
    },
    showLines: true,
    spanGaps: true,
    responsive: true,
    maintainAspectRatio: false,
    /**legend: {
      display: parent.labelShown
    },**/
    onClick: parent.handle
  };

  console.log(chartOptions);

  parent.renderChart(
    {
      labels: parent.dates,
      datasets: [
        {
          label: parent.label, //Aus den Props
          type: "line",
          data: parent.data, //Array gefiltert aus den Props
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)"
        }
      ]
    },
    chartOptions
  );
}
</script>