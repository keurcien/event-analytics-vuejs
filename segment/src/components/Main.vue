<template>
  <div>
    <button v-on:click="search">Request</button>
    <div>
      {{ campaign_ids }}
    </div>
    <highcharts :options="options"></highcharts>
  </div>
</template>

<script>
import axios from 'axios';
import { Chart } from 'highcharts-vue';

export default {
  name: 'Main',
  components: {
    highcharts: Chart,
  },
  data() {
    return {
      campaign_ids: null,
      xAxis: this.generateDateRange(),
      options: {
        xAxis: {
          categories: null,
        },
        series: [],
      },
    };
  },
  methods: {
    search() {
      axios.post('http://localhost:8081/search').then((response) => {
        this.results = response.data;
        this.parseResponse(this.results);
      }).then(() => {
        this.getChartValues();
      });
    },
    generateDateRange() {
      return ['2019-12-25', '2019-12-26', '2019-12-27', '2019-12-28', '2019-12-29', '2019-12-30'];
    },
    parseResponse(response) {
      const summary = {};
      response.campaigns.forEach((id) => {
        const x1 = [];
        const y1 = [];
        id.date.buckets.forEach((obj) => {
          x1.push(obj.key_as_string.substring(0, 10));
          y1.push(obj.campaign_spend.value);
        });
        summary[id.key] = {
          dates: x1,
          values: y1,
        };
        return summary;
      });
      this.campaign_ids = summary;
    },
    getxAxis() {
      const ids = Object.keys(this.campaign_ids);
      let res = [];
      for (let i = 0; i < ids.length; i += 1) {
        res = res.concat(this.campaign_ids[ids[i]].dates);
      }
      this.xAxis = [...new Set(res)];
    },
    getChartValues() {
      const ids = Object.keys(this.campaign_ids);
      for (let i = 0; i < ids.length; i += 1) {
        this.options.xAxis.categories = this.campaign_ids[ids[i]].dates;
        this.options.series.push(
          { data: this.campaign_ids[ids[i]].values },
        );
      }
      this.getxAxis();
      // console.log(this.options);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
