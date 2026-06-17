const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { calculateKundli } = require("./kundli");
const { searchCities } = require("./cities");

const app = express();

const PORT = process.env.PORT || 3000;

const BACKEND_BASE_URL = "https://kundli-free-tool-backend.onrender.com";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.json({
    status: "ok",
    message: "Kundli.com Free Kundli Backend is running"
  });
});

app.get("/health", function (req, res) {
  res.json({
    status: "healthy",
    service: "kundli-free-tool",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/cities", function (req, res) {
  const query = req.query.query || "";
  const cities = searchCities(query);

  res.json({
    success: true,
    cities
  });
});

app.post("/api/free-kundli", function (req, res) {
  try {
    const {
      name,
      dateOfBirth,
      timeOfBirth,
      birthPlace,
      latitude,
      longitude,
      timezone
    } = req.body;

    if (!name || !dateOfBirth || !timeOfBirth || !birthPlace) {
      return res.status(400).json({
        success: false,
        error: "Missing required birth details"
      });
    }

    const result = calculateKundli({
      name,
      dateOfBirth,
      timeOfBirth,
      birthPlace,
      latitude,
      longitude,
      timezone
    });

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Kundli calculation failed",
      details: error.message
    });
  }
});

app.get("/api/free-kundli-test", function (req, res) {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Free Kundli Test</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f7f2e8;
      padding: 30px;
      color: #24170f;
    }

    .container {
      max-width: 1050px;
      margin: 0 auto;
      background: #fffaf1;
      padding: 28px;
      border-radius: 18px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.12);
    }

    h1 {
      margin-top: 0;
      font-size: 32px;
    }

    p {
      line-height: 1.5;
    }

    form {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
      margin-bottom: 24px;
    }

    label {
      font-weight: bold;
      font-size: 14px;
    }

    input {
      width: 100%;
      padding: 12px;
      margin-top: 6px;
      border: 1px solid #d7c6a5;
      border-radius: 10px;
      font-size: 15px;
      box-sizing: border-box;
    }

    .place-wrapper {
      position: relative;
    }

    .city-suggestions {
      display: none;
      position: absolute;
      z-index: 20;
      left: 0;
      right: 0;
      top: 72px;
      background: white;
      border: 1px solid #d7c6a5;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 22px rgba(0,0,0,0.12);
      max-height: 260px;
      overflow-y: auto;
    }

    .city-option {
      padding: 11px 12px;
      cursor: pointer;
      border-bottom: 1px solid #f1e3cc;
      font-size: 14px;
    }

    .city-option:hover {
      background: #fff3d8;
    }

    .city-option:last-child {
      border-bottom: 0;
    }

    .selected-city {
      font-size: 12px;
      margin-top: 6px;
      color: #6d1b1b;
      font-weight: bold;
    }

    button {
      grid-column: 1 / -1;
      background: #6d1b1b;
      color: white;
      border: 0;
      border-radius: 999px;
      padding: 14px 22px;
      font-size: 17px;
      cursor: pointer;
      font-weight: bold;
    }

    button:hover {
      background: #501111;
    }

    .result {
      margin-top: 20px;
      display: none;
    }

    .summary {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px;
      margin-bottom: 20px;
    }

    .card {
      background: #fff3d8;
      border: 1px solid #e6c98e;
      border-radius: 14px;
      padding: 14px;
    }

    .card-title {
      font-size: 12px;
      text-transform: uppercase;
      opacity: 0.7;
      margin-bottom: 6px;
    }

    .card-value {
      font-size: 19px;
      font-weight: bold;
    }

    .settings-box {
      background: #fff;
      border: 1px solid #ead8b8;
      border-radius: 14px;
      padding: 12px;
      margin-bottom: 20px;
      font-size: 13px;
    }

    .chart-wrap {
      display: flex;
      justify-content: center;
      margin: 20px 0 32px;
    }

    .north-chart {
      width: 520px;
      height: 520px;
      max-width: 100%;
      position: relative;
      background: #fff;
      border: 2px solid #6d1b1b;
      overflow: hidden;
      box-shadow: 0 8px 20px rgba(0,0,0,0.08);
    }

    .north-chart svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    .chart-label {
      position: absolute;
      width: 96px;
      min-height: 42px;
      text-align: center;
      font-size: 12px;
      line-height: 1.25;
      transform: translate(-50%, -50%);
      color: #24170f;
      pointer-events: none;
    }

    .chart-label strong {
      display: block;
      font-size: 13px;
      color: #6d1b1b;
    }

    .chart-label span {
      display: block;
      font-weight: bold;
      margin-top: 3px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
      background: white;
      border-radius: 14px;
      overflow: hidden;
    }

    th, td {
      border: 1px solid #ead8b8;
      padding: 10px;
      text-align: left;
      font-size: 14px;
    }

    th {
      background: #6d1b1b;
      color: white;
    }

    .houses {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      margin-top: 12px;
    }

    .house {
      background: #fff;
      border: 1px solid #ead8b8;
      border-radius: 12px;
      padding: 12px;
      min-height: 80px;
    }

    .house strong {
      display: block;
      margin-bottom: 6px;
    }

    .premium-box {
      margin-top: 30px;
      background: #6d1b1b;
      color: white;
      padding: 22px;
      border-radius: 18px;
      text-align: center;
    }

    .premium-box h2 {
      margin-top: 0;
    }

    .premium-box a {
      display: inline-block;
      background: #ffd37a;
      color: #24170f;
      padding: 13px 22px;
      border-radius: 999px;
      text-decoration: none;
      font-weight: bold;
      margin-top: 8px;
    }

    .error {
      color: #9d1111;
      font-weight: bold;
      margin-top: 15px;
    }

    @media (max-width: 700px) {
      body {
        padding: 15px;
      }

      .container {
        padding: 18px;
      }

      form, .summary, .houses {
        grid-template-columns: 1fr;
      }

      .city-suggestions {
        top: 72px;
      }

      .north-chart {
        width: 330px;
        height: 330px;
      }

      .chart-label {
        width: 70px;
        font-size: 10px;
      }

      .chart-label strong {
        font-size: 10px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Free Kundli Test</h1>
    <p>This is only our private testing page. Later we will convert this into Shopify homepage design.</p>

    <form id="kundliForm">
      <div>
        <label>Name</label>
        <input name="name" value="Rahul" required>
      </div>

      <div>
        <label>Date of Birth</label>
        <input name="dateOfBirth" type="date" value="1995-08-15" required>
      </div>

      <div>
        <label>Time of Birth</label>
        <input name="timeOfBirth" type="time" value="14:30" required>
      </div>

      <div class="place-wrapper">
        <label>Birth Place</label>
        <input id="birthPlaceInput" name="birthPlace" value="New Delhi, Delhi, India" autocomplete="off" required>
        <div class="city-suggestions" id="citySuggestions"></div>
        <div class="selected-city" id="selectedCityText">Selected: New Delhi, Delhi, India</div>
      </div>

      <button type="submit">Generate Free Kundli</button>
    </form>

    <div id="error" class="error"></div>

    <div id="result" class="result">
      <h2>Kundli Summary</h2>
      <div class="summary" id="summary"></div>

      <div class="settings-box" id="settingsBox"></div>

      <h2>North Indian Lagna Chart</h2>
      <div class="chart-wrap">
        <div class="north-chart" id="northChart"></div>
      </div>

      <h2>Planetary Details</h2>
      <table>
        <thead>
          <tr>
            <th>Planet</th>
            <th>Sign</th>
            <th>Degree</th>
            <th>Nakshatra</th>
            <th>Pada</th>
          </tr>
        </thead>
        <tbody id="planetRows"></tbody>
      </table>

      <h2>House-wise Chart Data</h2>
      <div class="houses" id="houses"></div>

      <div class="premium-box">
        <h2>Want Your Full Premium Kundli Report?</h2>
        <p>Get detailed house analysis, yogas, dashas, dosha checks, remedies, and a complete PDF-style report.</p>
        <a href="/products/janam-kundali">Get Premium Kundli</a>
      </div>
    </div>
  </div>

  <script>
    const BACKEND_BASE_URL = "${BACKEND_BASE_URL}";

    const form = document.getElementById("kundliForm");
    const resultBox = document.getElementById("result");
    const summaryBox = document.getElementById("summary");
    const settingsBox = document.getElementById("settingsBox");
    const planetRows = document.getElementById("planetRows");
    const housesBox = document.getElementById("houses");
    const northChart = document.getElementById("northChart");
    const errorBox = document.getElementById("error");
    const birthPlaceInput = document.getElementById("birthPlaceInput");
    const citySuggestions = document.getElementById("citySuggestions");
    const selectedCityText = document.getElementById("selectedCityText");

    let selectedCity = {
      name: "New Delhi",
      displayName: "New Delhi, Delhi, India",
      latitude: 28.6139,
      longitude: 77.2090,
      timezone: "Asia/Kolkata"
    };

    let citySearchTimer = null;

    birthPlaceInput.addEventListener("input", function () {
      selectedCity = null;
      selectedCityText.textContent = "Please select a city from suggestions";

      clearTimeout(citySearchTimer);

      citySearchTimer = setTimeout(function () {
        searchCityOptions(birthPlaceInput.value);
      }, 250);
    });

    birthPlaceInput.addEventListener("focus", function () {
      searchCityOptions(birthPlaceInput.value);
    });

    document.addEventListener("click", function (event) {
      if (!event.target.closest(".place-wrapper")) {
        citySuggestions.style.display = "none";
      }
    });

    async function searchCityOptions(query) {
      try {
        const response = await fetch(BACKEND_BASE_URL + "/api/cities?query=" + encodeURIComponent(query));
        const data = await response.json();

        if (!data.success) {
          citySuggestions.style.display = "none";
          return;
        }

        if (!data.cities.length) {
          citySuggestions.innerHTML = '<div class="city-option">No city found in current test database</div>';
          citySuggestions.style.display = "block";
          return;
        }

        citySuggestions.innerHTML = data.cities.map(function (city) {
          return '<div class="city-option" data-city="' + encodeURIComponent(JSON.stringify(city)) + '">' +
            city.displayName +
          '</div>';
        }).join("");

        citySuggestions.style.display = "block";
      } catch (error) {
        citySuggestions.style.display = "none";
      }
    }

    citySuggestions.addEventListener("click", function (event) {
      const option = event.target.closest(".city-option");

      if (!option || !option.dataset.city) {
        return;
      }

      selectedCity = JSON.parse(decodeURIComponent(option.dataset.city));
      birthPlaceInput.value = selectedCity.displayName;
      selectedCityText.textContent = "Selected: " + selectedCity.displayName;
      citySuggestions.style.display = "none";
    });

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      errorBox.textContent = "";
      resultBox.style.display = "none";

      const formData = new FormData(form);

      if (!selectedCity) {
        errorBox.textContent = "Please select a birth place from the suggestions.";
        return;
      }

      const payload = {
        name: formData.get("name"),
        dateOfBirth: formData.get("dateOfBirth"),
        timeOfBirth: formData.get("timeOfBirth"),
        birthPlace: selectedCity.displayName,
        latitude: selectedCity.latitude,
        longitude: selectedCity.longitude,
        timezone: selectedCity.timezone
      };

      try {
        const response = await fetch(BACKEND_BASE_URL + "/api/free-kundli", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const responseText = await response.text();

        let data;

        try {
          data = JSON.parse(responseText);
        } catch (jsonError) {
          throw new Error("Backend returned non-JSON response: " + responseText.slice(0, 120));
        }

        if (!data.success) {
          throw new Error(data.error || data.details || "Something went wrong");
        }

        renderResult(data);
      } catch (error) {
        errorBox.textContent = error.message;
      }
    });

    function renderResult(data) {
      resultBox.style.display = "block";

      summaryBox.innerHTML = [
        ["Lagna", data.summary.lagnaSign],
        ["Lagna Nakshatra", data.summary.lagnaNakshatra + " Pada " + data.summary.lagnaPada],
        ["Moon Sign", data.summary.moonSign],
        ["Moon Nakshatra", data.summary.moonNakshatra + " Pada " + data.summary.moonPada]
      ].map(function (item) {
        return '<div class="card"><div class="card-title">' + item[0] + '</div><div class="card-value">' + item[1] + '</div></div>';
      }).join("");

      settingsBox.innerHTML =
        '<strong>Calculation Settings:</strong> ' +
        data.calculationSettings.zodiac + ', ' +
        data.calculationSettings.ayanamsa + ', ' +
        data.calculationSettings.houseSystem + '<br>' +
        '<strong>Birth Timezone:</strong> ' + data.calculationSettings.timezone +
        ' | Offset used: ' + data.calculationSettings.timezoneOffsetUsed +
        ' | UTC used: ' + data.calculationSettings.utcDateTimeUsed;

      planetRows.innerHTML = Object.keys(data.planets).map(function (key) {
        const p = data.planets[key];

        return '<tr>' +
          '<td>' + p.name + '</td>' +
          '<td>' + p.sign + '</td>' +
          '<td>' + p.degreeInSign + '</td>' +
          '<td>' + p.nakshatra + '</td>' +
          '<td>' + p.pada + '</td>' +
        '</tr>';
      }).join("");

      housesBox.innerHTML = Object.keys(data.chart).map(function (houseKey) {
        const h = data.chart[houseKey];
        const planets = h.planets.length
          ? h.planets.map(function (p) {
              return p.shortName + " " + p.degreeInSign + "°";
            }).join(", ")
          : "No planets";

        return '<div class="house">' +
          '<strong>House ' + h.houseNumber + ' - ' + h.sign + '</strong>' +
          '<div>' + planets + '</div>' +
        '</div>';
      }).join("");

      renderNorthIndianChart(data.chart);
    }

    function renderNorthIndianChart(chart) {
      const positions = {
        1: { x: 50, y: 25 },
        2: { x: 25, y: 8 },
        3: { x: 8, y: 25 },
        4: { x: 25, y: 50 },
        5: { x: 8, y: 75 },
        6: { x: 25, y: 92 },
        7: { x: 50, y: 75 },
        8: { x: 75, y: 92 },
        9: { x: 92, y: 75 },
        10: { x: 75, y: 50 },
        11: { x: 92, y: 25 },
        12: { x: 75, y: 8 }
      };

      const svg = '<svg viewBox="0 0 100 100" preserveAspectRatio="none">' +
        '<line x1="0" y1="0" x2="100" y2="100" stroke="#6d1b1b" stroke-width="0.45"/>' +
        '<line x1="100" y1="0" x2="0" y2="100" stroke="#6d1b1b" stroke-width="0.45"/>' +
        '<line x1="50" y1="0" x2="100" y2="50" stroke="#6d1b1b" stroke-width="0.45"/>' +
        '<line x1="100" y1="50" x2="50" y2="100" stroke="#6d1b1b" stroke-width="0.45"/>' +
        '<line x1="50" y1="100" x2="0" y2="50" stroke="#6d1b1b" stroke-width="0.45"/>' +
        '<line x1="0" y1="50" x2="50" y2="0" stroke="#6d1b1b" stroke-width="0.45"/>' +
      '</svg>';

      const labels = Object.keys(chart).map(function (houseKey) {
        const house = chart[houseKey];
        const position = positions[house.houseNumber];

        const planetText = house.planets.length
          ? house.planets.map(function (p) {
              return p.shortName;
            }).join(" ")
          : "";

        return '<div class="chart-label" style="left:' + position.x + '%; top:' + position.y + '%;">' +
          '<strong>H' + house.houseNumber + ' / ' + house.signNumber + '</strong>' +
          '<span>' + planetText + '</span>' +
        '</div>';
      }).join("");

      northChart.innerHTML = svg + labels;
    }
  </script>
</body>
</html>
  `);
});

app.listen(PORT, function () {
  console.log("Kundli backend running on port " + PORT);
});