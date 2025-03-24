<template>
    <div class="flex justify-center items-center bg-gray-900 min-h-screen p-4 landscape:h-[95dvh]">
      <div class="w-full max-w-5xl bg-gray-800 rounded-2xl p-4 shadow-lg flex flex-col items-center">
        <h2 class="text-white text-center text-xl font-semibold mb-2">
          {{ currentMode === 'running' ? '🏃 Running Progress' : '🇮🇹 Italian Study Progress' }}
        </h2>
  
        <div class="mb-4">
          <button
            @click="handleModeChange('running')"
            :class="currentMode === 'running' ? 'bg-blue-500' : 'bg-gray-600'"
            class="text-white py-2 px-4 rounded-l-md"
          >
            Running
          </button>
          <button
            @click="handleModeChange('italian')"
            :class="currentMode === 'italian' ? 'bg-blue-500' : 'bg-gray-600'"
            class="text-white py-2 px-4 rounded-r-md"
          >
            Italian Study
          </button>
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
        fetchedData: [],
        loading: true,
        error: null,
        hasData: false,
        apiUrls: {
          running: "https://script.google.com/macros/s/AKfycbxKydiLdv9R6g49K7NHJ9T2uorJT_hj_7pWIyldK1nXskUOvfodQppH-QRsNdylGvOh/exec",
          italian: "https://script.google.com/macros/s/AKfycbzlH9cJfJos_4sJ45tybealgTcObkBNBHcSmOcsk6niYvEmky-45dKUIf1VwGyH1apxtQ/exec"
        }
      };
    },
    mounted() {
      this.fetchData();
    },
    beforeUnmount() {
      this.destroyChart();
    },
    methods: {
      handleModeChange(mode) {
        this.destroyChart();
        this.currentMode = mode;
        this.fetchData();
      },
      
      destroyChart() {
        if (this.chartInstance) {
          this.chartInstance.destroy();
          this.chartInstance = null;
        }
        this.hasData = false;
      },
      
      fetchData() {
        this.loading = true;
        this.error = null;
        this.hasData = false;
        
        const callbackName = `jsonpCallback${Date.now()}`;
        
        window[callbackName] = (data) => {
          this.loading = false;
          
          if (data.success) {
            this.fetchedData = data.data;
            this.$nextTick(() => {
              this.hasData = true;
              this.$nextTick(() => {
                this.renderChart();
              });
            });
          } else {
            this.error = data.message || "Failed to fetch data";
          }
          
          delete window[callbackName];
        };
        
        const script = document.createElement("script");
        script.src = `${this.apiUrls[this.currentMode]}?callback=${callbackName}&action=fetchData`;
        script.async = true;
        
        script.onerror = () => {
          this.loading = false;
          this.error = "Failed to load data";
          delete window[callbackName];
          document.body.removeChild(script);
        };
        
        document.body.appendChild(script);
        script.onload = () => document.body.removeChild(script);
        
        // Safety timeout
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
                label: "Weight Goal",
                data: filteredData.map(d => d.weight - weightGoal),
                borderColor: "rgba(255, 99, 132, 0.8)",
                fill: false,
              },
            ];
          } else {
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
      }
    }
  };
  </script>
  
  <style scoped>
  @media (orientation: landscape) {
    .landscape { height: 95dvh; max-width: 90vw; }
  }
  </style>
