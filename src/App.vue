<template>
  <div class="flex justify-center bg-gray-900 min-h-screen p-4 landscape:h-[97.5dvh]">
    <div class="w-full flex flex-col items-center">
      <!-- <h2 class="text-white text-center text-xl font-semibold mb-2">
        {{ currentMode === 'running' ? '🏃 Running Progress' : '🇮🇹 Italian Study Progress' }}
      </h2> -->

      <div class="mb-4 flex gap-2 text-xl">
        <button
          @click="handleModeChange('running')"
          :class="currentMode === 'running' ? 'bg-blue-500' : 'bg-gray-600'"
          class="text-white py-2 px-3 rounded-l-md"
        >
        🏃
        </button>
        <button
          @click="handleModeChange('italian')"
          :class="currentMode === 'italian' ? 'bg-blue-500' : 'bg-gray-600'"
          class="text-white py-2 px-3 rounded-md"
        >
        🇮🇹
        </button>
        <button
          @click="handleModeChange('yoga')"
          :class="currentMode === 'yoga' ? 'bg-blue-500' : 'bg-gray-600'"
          class="text-white py-2 px-3 rounded-md"
        >
        🧘‍♂️
        </button>
        <button
          @click="handleModeChange('swimming')"
          :class="currentMode === 'swimming' ? 'bg-blue-500' : 'bg-gray-600'"
          class="text-white py-2 px-3 rounded-md"
        >
        🏊
        </button>
        <button
          @click="handleModeChange('training')"
          :class="currentMode === 'training' ? 'bg-blue-500' : 'bg-gray-600'"
          class="text-white py-2 px-3 rounded-md"
        >
        💪
        </button>
        <button
          @click="handleModeChange('weight')"
          :class="currentMode === 'weight' ? 'bg-blue-500' : 'bg-gray-600'"
          class="text-white py-2 px-3 rounded-r-md"
        >
        🫃🏻
        </button>
        <button
          @click="handleModeChange('alchool')"
          :class="currentMode === 'alchool' ? 'bg-blue-500' : 'bg-gray-600'"
          class="text-white py-2 px-3 rounded-r-md"
        >
        🍺
        </button>
      </div>

      <div  v-if="hasData && !error">
        <div v-if="currentMode == 'yoga'">
          <button
            @click="registerYoga()"
            class="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-md transition duration-300 ease-in-out"
          >
            登録
          </button>
        </div>
        <div v-if="currentMode == 'alchool'">
          <button
            @click="registerAlchool()"
            class="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-md transition duration-300 ease-in-out"
          >
            登録
          </button>
        </div>
        <div v-if="currentMode == 'training'">
          <button
            @click="registerTraining()"
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
              class="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              min="1"
              placeholder="例: 20"
            />
  
            <button
              @click="registerSwimming()"
              class="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow transition duration-300"
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
              class="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              min="1"
              placeholder="例: 65"
            />
  
            <button
              @click="registerWeight()"
              class="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow transition duration-300"
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
              class="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              min="1"
              placeholder="勉強中のコース"
            />
  
            <button
              @click="registerItalian()"
              class="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow transition duration-300"
            >
              登録
            </button>
          </div>
        </div>
        <div v-if="currentMode == 'running'" class="px-3 w-full max-w-[500px] mx-auto">
          <div class="flex flex-wrap items-center justify-between gap-2">
              <input
                v-model="resultNum"
                type="number"
                class="flex-1 min-w-[80px] px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="距離"
              />
              <input
                v-model="paceNum"
                type="number"
                class="flex-1 min-w-[80px] px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="ペース"
              />
              <button
                @click="registerRunning()"
                class="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow transition duration-300 whitespace-nowrap"
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
      <div v-else class="relative w-full h-[75dvh] md:h-[50vh] landscape:h-[80dvh]">
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
      baseUrl: "https://script.google.com/macros/s/AKfycbzK2vk5vFEjkeOKLZDdMRMyXntQP9fdMhv4ddRoSBqu4ZLvLZrO5MVvN8hlxIGjxZs/exec",

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
          
          // labels = filteredData.map(d => d.date);
          labels = filteredData.map(d => {
            const utcDate = new Date(d.date);
            const jstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000); // JST = UTC+9
            const month = String(jstDate.getMonth() + 1).padStart(2, '0');
            const day = String(jstDate.getDate()).padStart(2, '0');
            return `${month}/${day}`; // Example: "05/06"
          });
          // labels = filteredData.map(d => {
          //   const dateObj = new Date(d.date.replace(/-/g, '/')); // handle possible "2025-05-06" or "2025/05/06"
          //   const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          //   const day = String(dateObj.getDate()).padStart(2, '0');
          //   return `${month}${day}`; // like "0506"
          // });
          datasets = [
            { label: "Goal", data: filteredData.map(d => d.goal), borderColor: "rgba(128, 128, 128, 0.5)", fill: false },
            { label: "Result", data: filteredData.map(d => d.result), borderColor: "#3B82F6", fill: false },
            { label: "Pace Goal", data: filteredData.map(d => d.paceGoal), borderColor: "rgba(255, 165, 0, 0.7)", fill: false },
            { label: "Pace", data: filteredData.map(d => d.pace), borderColor: "rgba(50, 205, 50, 0.8)", fill: false },
            { label: "Days since", data: filteredData.map(d => d.daysSince), borderColor: "rgba(220, 60, 60, 0.8)", fill: false }
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
        } else if(this.currentMode === "training") {
          const filteredData = this.fetchedData.filter(d => d && d.date);
          
          if (filteredData.length === 0) {
              this.error = "No training data available";
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
          const rawData = this.fetchedData.filter(d => d && d.date && d.weight != null);

          if (rawData.length === 0) {
            this.error = "No weight data available";
            return;
          }

          const filledData = this.generateFilledWeightData(rawData);

          labels = filledData.map(d => {
            const date = new Date(d.date);
            return `${date.getMonth() + 1}-${date.getDate()}`;
          });

          datasets = [
            {
              label: "Weight",
              data: filledData.map(d => d.weight),
              borderColor: "#EF4444",
              spanGaps: true,
              fill: false,
              segment: {
                borderDash: ctx => ctx.p0.raw && ctx.p0.raw.isFilled ? [5, 5] : undefined,
              },
              pointRadius: ctx => ctx.raw && ctx.raw.isFilled ? 0 : 3, // hide filled points
            }
          ];

        } else if (this.currentMode === "alchool") {
    const filteredData = this.fetchedData
        .filter(d => d && d.date)
        .sort((a, b) => new Date(a.date) - new Date(b.date)); // Ensure it's sorted

    if (filteredData.length === 0) {
        this.error = "No alchool data available";
        return;
    }

    const enhancedData = filteredData.map((d, i, arr) => {
        if (i === 0) {
            return { ...d, daysSince: "x" };
        } else {
            const currentDate = new Date(d.date);
            const prevDate = new Date(arr[i - 1].date);
            const diffTime = currentDate - prevDate;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            return { ...d, daysSince: diffDays };
        }
    });

    console.log(enhancedData);

    labels = enhancedData.map(d => {
        const date = new Date(d.date);
        return `${date.getMonth() + 1}-${date.getDate()}`;
    });

    datasets = [
        { label: "Date", data: enhancedData.map(d => d.date), borderColor: "rgba(128, 128, 128, 0.5)", fill: false },
        { label: "Days Since", data: enhancedData.map(d => d.daysSince), borderColor: "#EF4444", fill: false },
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
              legend: { display: false },
              tooltip: { titleColor: "#000", bodyColor: "#000", backgroundColor: "#E5E7EB" },
            },
          },
        });
      } catch (err) {
        console.error("Error creating chart:", err);
        this.error = "Error creating chart";
      }
    },

    generateFilledWeightData(data) {
      if (!data || data.length === 0) return [];

      const result = [];
      const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

      const formatDate = date => date.toISOString().split('T')[0];

      let i = 0;
      let currentDate = new Date(sorted[0].date);
      const endDate = new Date(sorted[sorted.length - 1].date);

      while (currentDate <= endDate) {
        const dateStr = formatDate(currentDate);

        const match = sorted[i] && formatDate(new Date(sorted[i].date)) === dateStr;

        if (match) {
          result.push({ ...sorted[i], isFilled: false });
          i++;
        } else {
          // find previous actual point
          const prev = result[result.length - 1];
          const next = sorted[i];

          if (prev && next) {
            const totalGap = (new Date(next.date) - new Date(prev.date)) / (1000 * 60 * 60 * 24);
            const currentGap = (currentDate - new Date(prev.date)) / (1000 * 60 * 60 * 24);

            if (totalGap > 0) {
              const interpolatedWeight = prev.weight + ((next.weight - prev.weight) * currentGap / totalGap);
              result.push({ date: dateStr, weight: interpolatedWeight, isFilled: true });
            }
          }
        }

        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // ✅ Check if final data point is missing and add it if needed
      const lastDataPointDate = formatDate(new Date(sorted[sorted.length - 1].date));
      const alreadyIncluded = result.some(r => formatDate(new Date(r.date)) === lastDataPointDate && !r.isFilled);
      if (!alreadyIncluded) {
        result.push({ ...sorted[sorted.length - 1], isFilled: false });
      }

      return result;
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
      } else if (this.currentMode === 'training') {
        data = this.allData.trainingData || [];
      } else if (this.currentMode === 'alchool') {
        data = this.allData.drinkingData || [];
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

    registerAlchool() {
      this.loading = true;
      this.error = null;
      
      const callbackName = `jsonpCallback${Date.now()}`;
      window[callbackName] = (response) => {
        console.log(response);

        delete window[callbackName];
      };

      const script = document.createElement("script");
      script.src = `${this.baseUrl}?action=addDrinkingData&callback=${callbackName}`;
      script.async = true;

      document.body.appendChild(script);
      script.onload = () => document.body.removeChild(script);

      setTimeout(() => {
        this.fetchAllData();
      }, 500);
    },

    registerTraining() {
      this.loading = true;
      this.error = null;
      
      const callbackName = `jsonpCallback${Date.now()}`;
      window[callbackName] = (response) => {
        console.log(response);

        delete window[callbackName];
      };

      const script = document.createElement("script");
      script.src = `${this.baseUrl}?action=addTrainingData&callback=${callbackName}`;
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

<style>
html,body{
  background-color: #111827;
}
@media (orientation: landscape) {
  .landscape { height: 95dvh; max-width: 90vw; }
}
</style>