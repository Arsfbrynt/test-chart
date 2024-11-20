<template>
  <div>
    <h1>Chart Performance Test</h1>
    <div v-for="chart in charts" :key="chart.name" style="margin-bottom: 50px">
      <h2>{{ chart.name }}</h2>
      <button @click="testPerformance(chart)">Render Chart</button>
      <p>
        Render Time:
        {{ chart.renderTime ? chart.renderTime.toFixed(2) : "Not Tested" }} ms
      </p>
      <!-- Each chart gets its own container -->
      <div :ref="(el) => (chart.container = el)" style="height: 400px"></div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { largeDataset } from "../utils/dataset";
import * as echarts from "echarts";
import Highcharts from "highcharts";
import Plotly from "plotly.js-dist";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  LineController,
} from "chart.js";
import ApexCharts from "apexcharts";

// Register all necessary Chart.js components
ChartJS.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
);

export default {
  name: "ChartTest",
  setup() {
    // Define the chart configurations
    const charts = ref([
      {
        name: "Chart.js",
        renderTime: null,
        container: null,
        render: (container) => {
          const canvas = document.createElement("canvas"); // Create a canvas element
          container.appendChild(canvas); // Attach it to the container
          new ChartJS(canvas, {
            type: "line",
            data: {
              labels: largeDataset.map((d) => d.x).slice(0, 5000), // Limit data points
              datasets: [
                {
                  label: "Dataset",
                  data: largeDataset.map((d) => d.y).slice(0, 5000),
                },
              ],
            },
            options: { responsive: true },
          });
        },
      },
      {
        name: "ECharts",
        renderTime: null,
        container: null,
        render: (container) => {
          const chart = echarts.init(container); // Initialize ECharts in the container
          chart.setOption({
            xAxis: { type: "value" },
            yAxis: { type: "value" },
            series: [
              { data: largeDataset.map((d) => [d.x, d.y]), type: "line" },
            ],
          });
        },
      },
      {
        name: "Highcharts",
        renderTime: null,
        container: null,
        render: (container) => {
          Highcharts.chart(container, {
            chart: { type: "line" },
            xAxis: { type: "linear" },
            series: [{ data: largeDataset.map((d) => [d.x, d.y]) }],
          });
        },
      },
      {
        name: "Plotly",
        renderTime: null,
        container: null,
        render: (container) => {
          Plotly.newPlot(container, [
            {
              x: largeDataset.map((d) => d.x),
              y: largeDataset.map((d) => d.y),
              type: "scatter",
            },
          ]);
        },
      },
      {
        name: "ApexCharts",
        renderTime: null,
        container: null,
        render: (container) => {
          const options = {
            chart: { type: "line", height: 400 },
            series: [
              {
                name: "Dataset",
                data: largeDataset.slice(0, 5000), // Limit data points
              },
            ],
            xaxis: { type: "numeric" },
          };
          const chart = new ApexCharts(container, options);
          chart.render();
        },
      },
    ]);

    // Test performance and render the chart
    const testPerformance = (chart) => {
      if (!chart.container) return; // Ensure the container exists
      chart.container.innerHTML = ""; // Reset the container
      const start = performance.now();
      chart.render(chart.container); // Render the chart
      const end = performance.now();
      chart.renderTime = end - start; // Record render time
    };

    return {
      charts,
      testPerformance,
    };
  },
};
</script>

<style scoped>
/* Ensure proper styling for chart containers */
div[ref] {
  width: 100%;
  height: 400px;
}
</style>
