<template>
    <div>
        Hier SVG Shit
        <div>
            <form id="options" action="/mapdata" method="GET" target="_blank">
            <div>
                <!-- state (county) -->
                <label for="BL_ID">Bundesland:</label>
                <select id="BL_ID" name="BL_ID">
                <option value="0">Alle</option>
                </select>
            </div>
            <div>
                <!-- resolution -->
                <label for="resolution">Auflösung:</label>
                <select id="resolution" name="resolution">
                <option value="low">Niedrig</option>
                <option selected="selected" value="medium">Mittel</option>
                <option value="high">Hoch</option>
                </select>
            </div>
            <div>
                <!-- zoomlevel -->
                <label for="zoom">Zoomlevel:</label>
                <input type="number" id="zoom" name="zoom" value="7">
            </div>
            <div>
                <input type="submit" value="JSON Antwort anzeigen">
            </div>
            </form>
        </div>

        <div>
            <!-- SVG for barchart-->
            <svg version="1.1" id="map_area"></svg>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
  name: "MapSVG",
  data() {
    return {
      error: null,
      loading: "",
      comment: "",
      commentMade: false,
      comments: []
    };
  },
  created() {
    this.initialize();
    this.handleOptionsChange();
  },
  methods: {
    fetchData() {
      let that = this;
      that.error = null;
      that.loading = true;

      let url = `http://localhost:8080/geo-data/`;
      axios
        .get(url)
        .then(function(response) {
          that.loading = false;
          console.log(response.data)
          that.comments = response.data;
        })
        .catch(function(error) {
          console.log(error);
          that.error = error.toString();
        });
    },
    submitComment() {
      let that = this;
      let user = that.$store.state.auth.session.user;

      axios
        .post("/api/v1/comments", {
          text: that.comment,
          problemId: this.problemId,
          userId: user._id
        })
        .then(function(response) {
          // response.data contains the new comment
          response.data.user = user;
          that.comments.push(response.data);
          that.commentMade = true;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    async getCountiesAsync () {
        const response = await window.fetch('/counties')
        const data = await response.json()
        return data
    },
    async getMapDataAsync (/*{ BL_ID = 0, resolution = 'high', zoom = 1 }*/) {
        // Build URL-encoded parameters after recommendation from  https://fetch.spec.whatwg.org/#fetch-api
        var url = new URL('/mapdata', window.location.href)
        var params = arguments[0]
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

        const response = await window.fetch(url)
        const data = await response.json()
        return data
    },
    getSelectedOptions () {
        let element = document.getElementById('BL_ID')
        const BL_ID = element.options[element.selectedIndex].value

        element = document.getElementById('resolution')
        const resolution = element.options[element.selectedIndex].value

        const zoom = document.getElementById('zoom').value

        return {
            BL_ID: BL_ID,
            resolution: resolution,
            zoom: zoom
        }
    },
    handleOptionsChange () {
        // Get selected parameters
        const parameters = this.getSelectedOptions()
        console.info('Options changed: ')
        console.info(parameters)
        // send get request with parameters
        this.getMapDataAsync(parameters)
            .then(function (data) {
            console.info('Mapdata received')
            this.processMapData(data)
            })
            .catch(function (err) {
            console.error('Something went wrong while requesting Mapdata!')
            console.error(err)
            })
    },
    processMapData (mapData) {
        const svg = document.getElementById('map_area')
        svg.innerHTML = ''

        // First Kreise and Landkreise, then the rest to prevent full coverage of cities etc.
        var prioCounties = ['Kreis', 'Landkreis']
        var filteredData = mapData.filter(attributes => {
            return this.attributesWithDesignation(attributes, prioCounties)
        })
        this.drawMapData(filteredData)

        filteredData = mapData.filter(attributes => {
            return !this.attributesWithDesignation(attributes, prioCounties)
        })
        this.drawMapData(filteredData)

        const svgBbox = svg.getBBox()
        svg.setAttribute('viewBox', svgBbox.x + ' ' + svgBbox.y + ' ' + svgBbox.width + ' ' + svgBbox.height)
        svg.setAttribute('width', svgBbox.width)
    },
    drawMapData (data) {
        const mapSvg = document.getElementById('map_area')

        if (!Array.isArray(data)) {
            data = [data]
        }

        data.forEach(dataElement => {
            dataElement.geometry.rings.forEach(ring => {
            const title = this.createSVGElement('title', { })
            title.textContent = dataElement.attributes.county

            var pathString = ''

            ring.forEach(coordinate => {
                pathString += 'L ' + coordinate[0] + ',' + coordinate[1] + ' '
            })

            pathString += 'Z'
            pathString = 'M' + pathString.substring(1)

            var path = this.createSVGElement('path', {
                d: pathString
            })

            path.appendChild(title)
            mapSvg.appendChild(path)
            })
        })
    },
    attributesWithDesignation (features, designations) {
        return designations.some(function (design) {
            return features.attributes.BEZ === design
        })
    },
    createSVGElement (name, attributes) {
        var element = document.createElementNS('http://www.w3.org/2000/svg', name)
        for (const attName in attributes) {
            element.setAttribute(attName, String(attributes[attName]))
        }
        return element
    },
    initialize () {
        this.getCountiesAsync()
            .then(function (counties) {
            // Sort Alphabetical by counties
            counties.sort(function (a, b) {
                var countyA = a[1].toUpperCase() // ignore upper and lowercase
                var countyB = b[1].toUpperCase() // ignore upper and lowercase
                return countyA < countyB ? -1 : 1
            })

            const countySelector = document.getElementById('BL_ID')

            counties.forEach(county => {
                const option = document.createElement('option')
                option.value = county[0]
                option.innerHTML = county[1]
                countySelector.appendChild(option)
            })
            })
            .catch(function (err) {
            console.error('Something went wrong while requesting counties!')
            console.error(err)
            })
    }
    }
};
</script>