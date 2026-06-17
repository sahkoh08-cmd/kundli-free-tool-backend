const sweph = require("sweph");
const { DateTime } = require("luxon");

const ZODIAC_SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces"
];

const NAKSHATRAS = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati"
];

const PLANETS = [
  { key: "sun", name: "Sun", shortName: "Su", swephId: 0 },
  { key: "moon", name: "Moon", shortName: "Mo", swephId: 1 },
  { key: "mars", name: "Mars", shortName: "Ma", swephId: 4 },
  { key: "mercury", name: "Mercury", shortName: "Me", swephId: 2 },
  { key: "jupiter", name: "Jupiter", shortName: "Ju", swephId: 5 },
  { key: "venus", name: "Venus", shortName: "Ve", swephId: 3 },
  { key: "saturn", name: "Saturn", shortName: "Sa", swephId: 6 },
  { key: "rahu", name: "Rahu", shortName: "Ra", swephId: 10 }
];

/*
  Swiss Ephemeris flags:
  SEFLG_SWIEPH = 2
  SEFLG_SPEED = 256
  SEFLG_SIDEREAL = 65536
*/
const PLANET_CALCULATION_FLAGS = 2 + 256 + 65536;

function normalizeDegree(degree) {
  let value = Number(degree) % 360;

  if (value < 0) {
    value += 360;
  }

  return value;
}

function getZodiacSign(longitude) {
  const normalized = normalizeDegree(longitude);
  const signIndex = Math.floor(normalized / 30);
  const degreeInSign = normalized - signIndex * 30;

  return {
    sign: ZODIAC_SIGNS[signIndex],
    signNumber: signIndex + 1,
    degreeInSign: Number(degreeInSign.toFixed(4))
  };
}

function getNakshatra(longitude) {
  const normalized = normalizeDegree(longitude);
  const nakshatraSize = 360 / 27;
  const padaSize = nakshatraSize / 4;

  const nakshatraIndex = Math.floor(normalized / nakshatraSize);
  const pada = Math.floor((normalized % nakshatraSize) / padaSize) + 1;

  return {
    nakshatra: NAKSHATRAS[nakshatraIndex],
    pada: pada
  };
}

function getLongitudeFromSwephResult(result) {
  if (Array.isArray(result)) {
    return result[0];
  }

  if (result && Array.isArray(result.data)) {
    return result.data[0];
  }

  if (result && Array.isArray(result.x)) {
    return result.x[0];
  }

  if (result && typeof result.longitude === "number") {
    return result.longitude;
  }

  if (result && typeof result.xlon === "number") {
    return result.xlon;
  }

  throw new Error("Could not read longitude from Swiss Ephemeris result");
}

function getHousesDataFromSwephResult(result) {
  if (result && result.data) {
    return result.data;
  }

  return result;
}

function getAyanamsa(julianDay) {
  if (typeof sweph.get_ayanamsa_ut === "function") {
    return Number(sweph.get_ayanamsa_ut(julianDay));
  }

  if (typeof sweph.get_ayanamsa === "function") {
    return Number(sweph.get_ayanamsa(julianDay));
  }

  return 23.75;
}

function getSiderealAscendantLongitude(julianDay, latitude, longitude) {
  /*
    We first calculate tropical Ascendant using Swiss Ephemeris houses,
    then manually subtract Lahiri ayanamsa to get Sidereal Lagna.
  */
  const housesResult = sweph.houses(
    julianDay,
    latitude,
    longitude,
    "P"
  );

  const housesData = getHousesDataFromSwephResult(housesResult);

  if (!housesData || !housesData.points || typeof housesData.points[0] !== "number") {
    throw new Error("Could not calculate Ascendant / Lagna from house data");
  }

  const tropicalAscendant = housesData.points[0];
  const ayanamsa = getAyanamsa(julianDay);
  const siderealAscendant = normalizeDegree(tropicalAscendant - ayanamsa);

  return {
    tropicalAscendant: Number(normalizeDegree(tropicalAscendant).toFixed(4)),
    ayanamsa: Number(ayanamsa.toFixed(4)),
    siderealAscendant: Number(siderealAscendant.toFixed(4))
  };
}

function calculateHouseFromSign(lagnaSignNumber, planetSignNumber) {
  let house = planetSignNumber - lagnaSignNumber + 1;

  if (house <= 0) {
    house += 12;
  }

  return house;
}

function createNorthIndianChartData(lagnaSignNumber, planets) {
  const houses = {};

  for (let i = 1; i <= 12; i++) {
    const signNumber = ((lagnaSignNumber + i - 2) % 12) + 1;

    houses[i] = {
      houseNumber: i,
      signNumber: signNumber,
      sign: ZODIAC_SIGNS[signNumber - 1],
      planets: []
    };
  }

  Object.keys(planets).forEach(function (planetKey) {
    const planet = planets[planetKey];
    const houseNumber = calculateHouseFromSign(lagnaSignNumber, planet.signNumber);

    houses[houseNumber].planets.push({
      name: planet.name,
      shortName: planet.shortName || planet.name,
      sign: planet.sign,
      degreeInSign: planet.degreeInSign
    });
  });

  return houses;
}

function getNavamsaSignFromLongitude(longitude) {
  const normalized = normalizeDegree(longitude);
  const signIndex = Math.floor(normalized / 30);
  const degreeInSign = normalized - signIndex * 30;

  /*
    One Navamsa = 3 degrees 20 minutes = 3.333333 degrees.
  */
  const navamsaPart = Math.floor(degreeInSign / (30 / 9));

  /*
    Movable signs start from themselves:
    Aries, Cancer, Libra, Capricorn

    Fixed signs start from 9th sign:
    Taurus, Leo, Scorpio, Aquarius

    Dual signs start from 5th sign:
    Gemini, Virgo, Sagittarius, Pisces
  */
  const movableSigns = [0, 3, 6, 9];
  const fixedSigns = [1, 4, 7, 10];

  let navamsaStartIndex;

  if (movableSigns.includes(signIndex)) {
    navamsaStartIndex = signIndex;
  } else if (fixedSigns.includes(signIndex)) {
    navamsaStartIndex = (signIndex + 8) % 12;
  } else {
    navamsaStartIndex = (signIndex + 4) % 12;
  }

  const navamsaSignIndex = (navamsaStartIndex + navamsaPart) % 12;

  return {
    sign: ZODIAC_SIGNS[navamsaSignIndex],
    signNumber: navamsaSignIndex + 1,
    navamsaPart: navamsaPart + 1
  };
}

function createNavamsaPlanets(planets) {
  const navamsaPlanets = {};

  Object.keys(planets).forEach(function (planetKey) {
    const planet = planets[planetKey];
    const navamsa = getNavamsaSignFromLongitude(planet.longitude);

    navamsaPlanets[planetKey] = {
      name: planet.name,
      shortName: planet.shortName,
      sign: navamsa.sign,
      signNumber: navamsa.signNumber,
      navamsaPart: navamsa.navamsaPart,
      sourceSign: planet.sign,
      sourceDegreeInSign: planet.degreeInSign
    };
  });

  return navamsaPlanets;
}

function createNavamsaAscendant(ascendant) {
  const navamsa = getNavamsaSignFromLongitude(ascendant.longitude);

  return {
    name: "Navamsa Lagna",
    shortName: "D9 As",
    sign: navamsa.sign,
    signNumber: navamsa.signNumber,
    navamsaPart: navamsa.navamsaPart,
    sourceSign: ascendant.sign,
    sourceDegreeInSign: ascendant.degreeInSign
  };
}

function createNavamsaChartData(navamsaLagnaSignNumber, navamsaPlanets) {
  const houses = {};

  for (let i = 1; i <= 12; i++) {
    const signNumber = ((navamsaLagnaSignNumber + i - 2) % 12) + 1;

    houses[i] = {
      houseNumber: i,
      signNumber: signNumber,
      sign: ZODIAC_SIGNS[signNumber - 1],
      planets: []
    };
  }

  Object.keys(navamsaPlanets).forEach(function (planetKey) {
    const planet = navamsaPlanets[planetKey];
    const houseNumber = calculateHouseFromSign(navamsaLagnaSignNumber, planet.signNumber);

    houses[houseNumber].planets.push({
      name: planet.name,
      shortName: planet.shortName || planet.name,
      sign: planet.sign
    });
  });

  return houses;
}

function parseBirthDateTimeInTimezone(dateOfBirth, timeOfBirth, timezone) {
  const dateParts = String(dateOfBirth).split("-").map(Number);
  const timeParts = String(timeOfBirth).split(":").map(Number);

  const year = dateParts[0];
  const month = dateParts[1];
  const day = dateParts[2];

  const hour = timeParts[0];
  const minute = timeParts[1];

  if (!year || !month || !day || Number.isNaN(hour) || Number.isNaN(minute)) {
    throw new Error("Invalid birth date or time");
  }

  const zone = timezone || "Asia/Kolkata";

  const localDateTime = DateTime.fromObject(
    {
      year,
      month,
      day,
      hour,
      minute,
      second: 0
    },
    {
      zone
    }
  );

  if (!localDateTime.isValid) {
    throw new Error("Invalid timezone or birth date/time: " + localDateTime.invalidExplanation);
  }

  const utcDateTime = localDateTime.toUTC();

  return {
    localDateTime,
    utcDateTime,
    timezone: zone,
    timezoneOffsetHours: localDateTime.offset / 60,
    yearUtc: utcDateTime.year,
    monthUtc: utcDateTime.month,
    dayUtc: utcDateTime.day,
    utcDecimalHour: utcDateTime.hour + utcDateTime.minute / 60 + utcDateTime.second / 3600
  };
}

function calculateKundli(input) {
  const {
    name,
    dateOfBirth,
    timeOfBirth,
    birthPlace,
    latitude,
    longitude,
    timezone
  } = input;

  const birthLatitude = Number(latitude);
  const birthLongitude = Number(longitude);

  if (Number.isNaN(birthLatitude) || Number.isNaN(birthLongitude)) {
    throw new Error("Latitude and longitude are required for Lagna calculation");
  }

  const birthTime = parseBirthDateTimeInTimezone(dateOfBirth, timeOfBirth, timezone);

  const julianDay = sweph.julday(
    birthTime.yearUtc,
    birthTime.monthUtc,
    birthTime.dayUtc,
    birthTime.utcDecimalHour,
    1
  );

  /*
    Ayanamsa:
    1 = Lahiri / Chitrapaksha
  */
  if (typeof sweph.set_sid_mode === "function") {
    sweph.set_sid_mode(1, 0, 0);
  }

  const planets = {};

  PLANETS.forEach(function (planet) {
    const result = sweph.calc_ut(julianDay, planet.swephId, PLANET_CALCULATION_FLAGS);
    const longitudeValue = getLongitudeFromSwephResult(result);

    const zodiac = getZodiacSign(longitudeValue);
    const nakshatra = getNakshatra(longitudeValue);

    planets[planet.key] = {
      name: planet.name,
      shortName: planet.shortName,
      longitude: Number(normalizeDegree(longitudeValue).toFixed(4)),
      sign: zodiac.sign,
      signNumber: zodiac.signNumber,
      degreeInSign: zodiac.degreeInSign,
      nakshatra: nakshatra.nakshatra,
      pada: nakshatra.pada
    };
  });

  const rahuLongitude = planets.rahu.longitude;
  const ketuLongitude = normalizeDegree(rahuLongitude + 180);
  const ketuZodiac = getZodiacSign(ketuLongitude);
  const ketuNakshatra = getNakshatra(ketuLongitude);

  planets.ketu = {
    name: "Ketu",
    shortName: "Ke",
    longitude: Number(ketuLongitude.toFixed(4)),
    sign: ketuZodiac.sign,
    signNumber: ketuZodiac.signNumber,
    degreeInSign: ketuZodiac.degreeInSign,
    nakshatra: ketuNakshatra.nakshatra,
    pada: ketuNakshatra.pada
  };

  const ascendantCalculation = getSiderealAscendantLongitude(
    julianDay,
    birthLatitude,
    birthLongitude
  );

  const ascendantZodiac = getZodiacSign(ascendantCalculation.siderealAscendant);
  const ascendantNakshatra = getNakshatra(ascendantCalculation.siderealAscendant);

  const ascendant = {
    name: "Lagna",
    shortName: "As",
    longitude: ascendantCalculation.siderealAscendant,
    sign: ascendantZodiac.sign,
    signNumber: ascendantZodiac.signNumber,
    degreeInSign: ascendantZodiac.degreeInSign,
    nakshatra: ascendantNakshatra.nakshatra,
    pada: ascendantNakshatra.pada
  };

  const chart = createNorthIndianChartData(ascendant.signNumber, planets);

  const navamsaPlanets = createNavamsaPlanets(planets);
  const navamsaAscendant = createNavamsaAscendant(ascendant);
  const navamsaChart = createNavamsaChartData(navamsaAscendant.signNumber, navamsaPlanets);

  return {
    success: true,
    calculationSettings: {
      zodiac: "Sidereal",
      ayanamsa: "Lahiri",
      ayanamsaDegree: ascendantCalculation.ayanamsa,
      tropicalAscendant: ascendantCalculation.tropicalAscendant,
      siderealAscendant: ascendantCalculation.siderealAscendant,
      nodeType: "Mean Rahu/Ketu",
      houseSystem: "Whole Sign",
      timezone: birthTime.timezone,
      timezoneOffsetUsed: birthTime.timezoneOffsetHours,
      utcDateTimeUsed: birthTime.utcDateTime.toISO()
    },
    birthDetails: {
      name,
      dateOfBirth,
      timeOfBirth,
      birthPlace,
      latitude: birthLatitude,
      longitude: birthLongitude,
      timezone: birthTime.timezone
    },
    summary: {
      lagnaSign: ascendant.sign,
      lagnaNakshatra: ascendant.nakshatra,
      lagnaPada: ascendant.pada,
      sunSign: planets.sun.sign,
      moonSign: planets.moon.sign,
      moonNakshatra: planets.moon.nakshatra,
      moonPada: planets.moon.pada,
      navamsaLagnaSign: navamsaAscendant.sign
    },
    ascendant,
    planets,
    chart,
    navamsa: {
      ascendant: navamsaAscendant,
      planets: navamsaPlanets,
      chart: navamsaChart
    }
  };
}

module.exports = {
  calculateKundli
};