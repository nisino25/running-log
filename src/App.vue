<template>
  <div class="flex justify-center items-center bg-gray-900 min-h-screen p-4 landscape:h-[95dvh]">
    <div class="w-full max-w-5xl bg-gray-800 rounded-2xl p-4 shadow-lg flex flex-col items-center">
      <h2 class="text-white text-center text-xl font-semibold mb-2">🏃 Running Progress</h2>
      <div class="relative w-full">
        <canvas ref="chartCanvas" class="w-full h-[60vh] md:h-[50vh] landscape:h-[80dvh]"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";

const chartCanvas = ref(null);
const chartInstance = ref(null);
const fetchedRunningLog = ref([]);

const getCachedData = (key) => {
  const cached = localStorage.getItem(key);
  return cached ? JSON.parse(cached) : null;
};

const cacheData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const fetchRunningLog = () => {
  const cachedData = getCachedData("runningLog");

  if (cachedData) {
    fetchedRunningLog.value = cachedData;
    renderRunningChart();
    return;
  }

  const callbackName = `jsonpCallback_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 5)}`;

  window[callbackName] = (data) => {
    if (data.success) {
      fetchedRunningLog.value = data.data;
      cacheData("runningLog", data.data);
      renderRunningChart();
    } else {
      console.error("Error fetching running data:", data.message);
    }
    delete window[callbackName]; // Cleanup
  };

  const script = document.createElement("script");
  script.src = `https://script.google.com/macros/s/AKfycbxKydiLdv9R6g49K7NHJ9T2uorJT_hj_7pWIyldK1nXskUOvfodQppH-QRsNdylGvOh/exec?callback=${callbackName}&action=fetchData`;
  script.async = true;
  document.body.appendChild(script);

  script.onload = () => {
    document.body.removeChild(script);
  };
};

const renderRunningChart = () => {
  if (!chartCanvas.value) return;

  if (chartInstance.value) {
    chartInstance.value.destroy(); // Destroy previous instance
  }

  const ctx = chartCanvas.value.getContext("2d");

  const filteredData = fetchedRunningLog.value.filter(
    (d) => d.result !== "" && d.result !== null
  );

  const labels = filteredData.map((d) => d.session);
  const goalData = filteredData.map((d) => d.goal);
  const resultData = filteredData.map((d) => d.result);

  chartInstance.value = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Goal",
          data: goalData,
          borderColor: "#D1D5DB",
          backgroundColor: "rgba(209, 213, 219, 0.5)",
          fill: false,
          tension: 0.2,
        },
        {
          label: "Result",
          data: resultData,
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59, 130, 246, 0.5)",
          fill: false,
          tension: 0.2,
          spanGaps: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: { color: "#E5E7EB" },
          grid: { color: "#374151" },
        },
        y: {
          ticks: { color: "#E5E7EB" },
          grid: { color: "#374151" },
        },
      },
      plugins: {
        legend: {
          labels: { color: "#E5E7EB" },
        },
        tooltip: {
          titleColor: "#000",
          bodyColor: "#000",
          backgroundColor: "#E5E7EB",
        },
      },
    },
  });
};

onMounted(fetchRunningLog);
</script>

<style scoped>
/* Makes sure everything fits nicely in landscape mode */
@media (orientation: landscape) {
  .landscape {
    height: 95dvh;
    max-width: 90vw;
  }

  canvas{
    height: 75dvh !important;
  }
}
</style>
