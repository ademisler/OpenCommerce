// Basit asgari ücret verileri (EUR cinsinden)
const wages = {
  "Austria": "N/A",
  "Belgium": 1990,
  "Bulgaria": 780,
  "Croatia": 700,
  "Cyprus": 1000,
  "Czechia": 750,
  "Denmark": "N/A",
  "Estonia": 820,
  "Finland": "N/A",
  "France": 1766,
  "Germany": 2050,
  "Greece": 910,
  "Hungary": 710,
  "Ireland": 1880,
  "Italy": "N/A",
  "Latvia": 700,
  "Lithuania": 924,
  "Luxembourg": 2400,
  "Malta": 840,
  "Netherlands": 1995,
  "Poland": 980,
  "Portugal": 886,
  "Romania": 660,
  "Slovakia": 750,
  "Slovenia": 1250,
  "Spain": 1323,
  "Sweden": "N/A"
};

function setupMap() {
  const svg = document.getElementById('eu-map');
  if (!svg) return;

  Object.keys(wages).forEach(country => {
    const el = document.getElementById(country);
    if (el) {
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => showInfo(country));
    }
  });
}

function showInfo(country) {
  const wage = wages[country];
  const info = document.getElementById('info');
  info.textContent = `${country}: ${wage} €`;
}

document.addEventListener('DOMContentLoaded', setupMap);
