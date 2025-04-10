<template>
  <div class="flex justify-center items-center bg-gray-900 min-h-screen p-4 landscape:h-[97.5dvh]">
    <div class="w-full flex flex-col items-center">
      <!-- <h2 class="text-white text-center text-xl font-semibold mb-2">
        {{ currentMode === 'running' ? '🏃 Running Progress' : '🇮🇹 Italian Study Progress' }}
      </h2> -->

      <div class="mb-4 flex gap-2 text-xl">
        <button
          @click="handleModeChange('running')"
          :class="currentMode === 'running' ? 'bg-blue-500' : 'bg-gray-600'"
          class="text-white py-2 px-4 rounded-l-md"
        >
        🏃
        </button>
        <button
          @click="handleModeChange('italian')"
          :class="currentMode === 'italian' ? 'bg-blue-500' : 'bg-gray-600'"
          class="text-white py-2 px-4 rounded-md"
        >
        🇮🇹
        </button>
        <button
          @click="handleModeChange('yoga')"
          :class="currentMode === 'yoga' ? 'bg-blue-500' : 'bg-gray-600'"
          class="text-white py-2 px-4 rounded-md"
        >
        🧘‍♂️
        </button>
        <button
          @click="handleModeChange('swimming')"
          :class="currentMode === 'swimming' ? 'bg-blue-500' : 'bg-gray-600'"
          class="text-white py-2 px-4 rounded-r-md"
        >
        🏊
        </button>
        <button
          @click="handleModeChange('weight')"
          :class="currentMode === 'weight' ? 'bg-blue-500' : 'bg-gray-600'"
          class="text-white py-2 px-4 rounded-r-md"
        >
        🫃🏻
        </button>
      </div>

      <div v-if="hasData && !error">
        <div v-if="currentMode == 'yoga'">
          <button
            @click="registerYoga()"
            class="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-md transition duration-300 ease-in-out"
          >
            登録
          </button>

        </div>
        <div v-if="currentMode == 'swimming'">
          <div class="flex items-center gap-2">
            <input
              v-model="swimmingLaps"
              type="number"
              id="laps"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              min="1"
              placeholder="例: 20"
            />
  
            <button
              @click="registerSwimming()"
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow transition duration-300"
            >
              登録
            </button>
          </div>
        </div>
        <div v-if="currentMode == 'weight'">
          <div class="flex items-center gap-2">
            <input
              v-model="weightNum"
              type="number"
              id="weightNum"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              min="1"
              placeholder="例: 65"
            />
  
            <button
              @click="registerWeight()"
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow transition duration-300"
            >
              登録
            </button>
          </div>
        </div>
        <div v-if="currentMode == 'italian'">
          <div class="flex items-center gap-2">
            <input
              v-model="courseNum"
              type="courseNum"
              id="courseNum"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              min="1"
              placeholder="勉強中のコース"
            />
  
            <button
              @click="registerItalian()"
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow transition duration-300"
            >
              登録
            </button>
          </div>
        </div>
        <div v-if="currentMode == 'running'">
          <div class="flex items-center gap-2">
            <input
              v-model="resultNum"
              type="number"
              id="resultNum"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              min="1"
              placeholder="距離"
            />
            <input
              v-model="paceNum"
              type="number"
              id="paceNum"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              min="1"
              placeholder="ペース"
            />
  
            <button
              @click="registerRunning()"
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow transition duration-300"
            >
              登録
            </button>
          </div>
        </div>

      </div>

      <div v-if="loading" class="flex justify-center items-center h-[60vh]">
        <div class="text-white text-lg">Loading data...</div>
      </div>
      <div v-else-if="error" class="flex justify-center items-center h-[60vh]">
        <div class="text-red-500 text-lg">{{ error }}</div>
      </div>
      <div v-else class="relative w-full h-[60vh] md:h-[50vh] landscape:h-[80dvh]">
        <!-- Only render canvas when we have data -->
        <canvas v-if="hasData" ref="chartCanvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart } from 'chart.js/auto';

export default {
  data() {
    return {
      currentMode: 'running',
      chartInstance: null,
      allData: {
        runningData: [],
        italianStudyData: [],
        yogaData: []
      },
      loading: true,
      error: null,
      hasData: false,
      baseUrl: "https://script.google.com/macros/s/AKfycbwcCN3CCcAnQ1UfXhtvJEPessRRFDKhSio1C-6qNQuXft8b5ZJ6jxecGMe1XwTMv0Ta/exec",

      swimmingLaps: null,
      weightNum: null,

      resultNum: null,
      paceNum: null,

      courseNum: null,
    };
  },
  mounted() {
    this.fetchAllData();
  },
  beforeUnmount() {
    this.destroyChart();
  },
  methods: {
    handleModeChange(mode) {
      this.destroyChart();
      this.currentMode = mode;
      this.updateChartData();
    },
    
    destroyChart() {
      if (this.chartInstance) {
        this.chartInstance.destroy();
        this.chartInstance = null;
      }
      this.hasData = false;
    },
    
    fetchAllData() {
      this.loading = true;
      this.error = null;

      const callbackName = `jsonpCallback${Date.now()}`;
      window[callbackName] = (response) => {
        this.loading = false;

        if (response.success) {
          this.allData = response.data;
          this.updateChartData();
        } else {
          this.error = response.message || "Failed to fetch data";
        }

        delete window[callbackName];
      };

      const script = document.createElement("script");
      script.src = `${this.baseUrl}?action=fetchAllSheets&callback=${callbackName}`;
      script.async = true;

      script.onerror = () => {
        this.loading = false;
        this.error = "Failed to load data";
        delete window[callbackName];
        document.body.removeChild(script);
      };

      document.body.appendChild(script);
      script.onload = () => document.body.removeChild(script);

      setTimeout(() => {
        if (this.loading) {
          this.loading = false;
          this.error = "Request timed out";
          delete window[callbackName];
        }
      }, 15000);
    },

    renderChart() {
      const canvas = this.$refs.chartCanvas;
      if (!canvas) {
        console.error("Canvas element not found");
        return;
      }
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error("Failed to get canvas context");
        return;
      }
      
      try {
        let labels = [];
        let datasets = [];
        
        if (this.currentMode === 'running') {
          const filteredData = this.fetchedData.filter(d => d && d.result);
          
          if (filteredData.length === 0) {
            this.error = "No running data available";
            return;
          }

          const weightGoal = 65;
          
          labels = filteredData.map(d => d.session);
          datasets = [
            { label: "Goal", data: filteredData.map(d => d.goal), borderColor: "rgba(128, 128, 128, 0.5)", fill: false },
            { label: "Result", data: filteredData.map(d => d.result), borderColor: "#3B82F6", fill: false },
            { label: "Pace Goal", data: filteredData.map(d => d.paceGoal), borderColor: "rgba(255, 165, 0, 0.7)", fill: false },
            { label: "Pace", data: filteredData.map(d => d.pace), borderColor: "rgba(50, 205, 50, 0.8)", fill: false },
            {
              label: `Weight Goal: ${weightGoal}kg`,
              data: filteredData.map(d => d.weight - weightGoal),
              borderColor: "rgba(255, 99, 132, 0.8)",
              fill: false,
            },
          ];
        } else if(this.currentMode === 'italian') {
          const filteredData = this.fetchedData.filter(d => d && d.result);
          
          if (filteredData.length === 0) {
              this.error = "No Italian study data available";
              return;
          }
      
          labels = filteredData.map(d => {
              const date = new Date(d.date);
              return `${date.getMonth() + 1}-${date.getDate()}`; // Format as MM-DD
          });
      
          datasets = [
              { label: "Unit Goal", data: filteredData.map(d => d.unitGoal), borderColor: "rgba(128, 128, 128, 0.5)", fill: false },
              { label: "Result", data: filteredData.map(d => d.result), borderColor: "#EF4444", fill: false },
          ];
        } else if(this.currentMode === "yoga") {
          const filteredData = this.fetchedData.filter(d => d && d.date);
          
          if (filteredData.length === 0) {
              this.error = "No yoga data available";
              return;
          }
      
          labels = filteredData.map(d => {
              const date = new Date(d.date);
              return `${date.getMonth() + 1}-${date.getDate()}`; // Format as MM-DD
          });
      
          datasets = [
              { label: "Date", data: filteredData.map(d => d.date), borderColor: "rgba(128, 128, 128, 0.5)", fill: false },
              { label: "Days Since", data: filteredData.map(d => d.daysSince), borderColor: "#EF4444", fill: false },
          ];
        } else if(this.currentMode === "swimming") {
          const filteredData = this.fetchedData.filter(d => d && d.date);
          
          if (filteredData.length === 0) {
              this.error = "No swimminf data available";
              return;
          }
      
          labels = filteredData.map(d => {
              const date = new Date(d.date);
              return `${date.getMonth() + 1}-${date.getDate()}`; // Format as MM-DD
          });
      
          datasets = [
              { label: "Date", data: filteredData.map(d => d.date), borderColor: "rgba(128, 128, 128, 0.5)", fill: false },
              {
                label: "Distance (100m units)",
                data: filteredData.map(d => (d.laps * 25) / 100),
                borderColor: "#3B82F6", // feel free to change the color
                fill: false
              },
              { label: "Days Since", data: filteredData.map(d => d.daysSince), borderColor: "#EF4444", fill: false },
          ];
        } else if(this.currentMode === "weight") {
          const filteredData = this.fetchedData.filter(d => d && d.date);
          
          if (filteredData.length === 0) {
              this.error = "No swimminf data available";
              return;
          }
      
          labels = filteredData.map(d => {
              const date = new Date(d.date);
              return `${date.getMonth() + 1}-${date.getDate()}`; // Format as MM-DD
          });
      
          datasets = [
              { label: "Date", data: filteredData.map(d => d.date), borderColor: "rgba(128, 128, 128, 0.5)", fill: false },
              { label: "Weight", data: filteredData.map(d => d.weight), borderColor: "#EF4444", fill: false },
          ];
        }

        
        this.chartInstance = new Chart(ctx, {
          type: "line",
          data: { labels, datasets },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: { ticks: { color: "#E5E7EB" }, grid: { color: "#374151" } },
              y: { ticks: { color: "#E5E7EB" }, grid: { color: "#374151" } },
            },
            plugins: {
              legend: { labels: { color: "#E5E7EB" } },
              tooltip: { titleColor: "#000", bodyColor: "#000", backgroundColor: "#E5E7EB" },
            },
          },
        });
      } catch (err) {
        console.error("Error creating chart:", err);
        this.error = "Error creating chart";
      }
    },

    updateChartData() {
      this.error = null;
      let data = [];

      if (this.currentMode === 'running') {
        data = this.allData.runningData || [];
      } else if (this.currentMode === 'italian') {
        data = this.allData.italianStudyData || [];
      } else if (this.currentMode === 'yoga') {
        data = this.allData.yogaData || [];
      } else if (this.currentMode === 'swimming') {
        data = this.allData.swimmingData || [];
      } else if (this.currentMode === 'weight') {
        data = this.allData.weightData || [];
      }

      this.fetchedData = data;

      if (!data || data.length === 0) {
        this.error = `No ${this.currentMode} data available`;
        return;
      }

      this.hasData = true;
      this.$nextTick(() => {
        this.renderChart();
      });
    },

    registerYoga() {
      this.loading = true;
      this.error = null;
      
      const callbackName = `jsonpCallback${Date.now()}`;
      window[callbackName] = (response) => {
        console.log(response);

        delete window[callbackName];
      };

      const script = document.createElement("script");
      script.src = `${this.baseUrl}?action=addCurrentJapaneseDate&callback=${callbackName}`;
      script.async = true;

      document.body.appendChild(script);
      script.onload = () => document.body.removeChild(script);

      setTimeout(() => {
        this.fetchAllData();
      }, 500);
    },

    registerSwimming() {
      this.loading = true;
      this.error = null;
      
      const callbackName = `jsonpCallback${Date.now()}`;
      window[callbackName] = (response) => {
        console.log(response);

        delete window[callbackName];
      };

      const script = document.createElement("script");
      script.src = `${this.baseUrl}?action=addSwimmingData&laps=${this.swimmingLaps}&callback=${callbackName}`;
      script.async = true;

      document.body.appendChild(script);
      script.onload = () => document.body.removeChild(script);

      setTimeout(() => {
        this.fetchAllData();
      }, 500);
    },

    registerWeight() {
      this.loading = true;
      this.error = null;
      
      const callbackName = `jsonpCallback${Date.now()}`;
      window[callbackName] = (response) => {
        console.log(response);

        delete window[callbackName];
      };

      const script = document.createElement("script");
      script.src = `${this.baseUrl}?action=addWeightData&weightNum=${this.weightNum}&callback=${callbackName}`;
      script.async = true;

      document.body.appendChild(script);
      script.onload = () => document.body.removeChild(script);

      setTimeout(() => {
        this.fetchAllData();
      }, 500);
    },

    registerRunning() {
      this.loading = true;
      this.error = null;
      
      const callbackName = `jsonpCallback${Date.now()}`;
      window[callbackName] = (response) => {
        console.log(response);

        delete window[callbackName];
      };

      const script = document.createElement("script");
      script.src = `${this.baseUrl}?action=addRunningData&resultNum=${this.resultNum}&paceNum=${this.paceNum}&callback=${callbackName}`;
      script.async = true;

      document.body.appendChild(script);
      script.onload = () => document.body.removeChild(script);

      setTimeout(() => {
        this.fetchAllData();
      }, 500);
    },

    registerItalian() {
      this.loading = true;
      this.error = null;
      
      const callbackName = `jsonpCallback${Date.now()}`;
      window[callbackName] = (response) => {
        console.log(response);

        delete window[callbackName];
      };

      const script = document.createElement("script");
      script.src = `${this.baseUrl}?action=addItalianData&courseNum=${this.courseNum}&callback=${callbackName}`;
      script.async = true;

      document.body.appendChild(script);
      script.onload = () => document.body.removeChild(script);

      setTimeout(() => {
        this.fetchAllData();
      }, 500);
    },




  }
};
</script>

<style scoped>
@media (orientation: landscape) {
  .landscape { height: 95dvh; max-width: 90vw; }
}
</style>
