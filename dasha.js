const { DateTime } = require("luxon");

const DASHAS = [
  { key: "ketu", name: "Ketu", shortName: "Ke", years: 7 },
  { key: "venus", name: "Venus", shortName: "Ve", years: 20 },
  { key: "sun", name: "Sun", shortName: "Su", years: 6 },
  { key: "moon", name: "Moon", shortName: "Mo", years: 10 },
  { key: "mars", name: "Mars", shortName: "Ma", years: 7 },
  { key: "rahu", name: "Rahu", shortName: "Ra", years: 18 },
  { key: "jupiter", name: "Jupiter", shortName: "Ju", years: 16 },
  { key: "saturn", name: "Saturn", shortName: "Sa", years: 19 },
  { key: "mercury", name: "Mercury", shortName: "Me", years: 17 }
];

const NAKSHATRA_LORDS = [
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury"
];

const DAYS_PER_YEAR = 365.2425;

function normalizeDegree(degree) {
  let value = Number(degree) % 360;

  if (value < 0) {
    value += 360;
  }

  return value;
}

function getDashaByName(name) {
  return DASHAS.find(function (dasha) {
    return dasha.name.toLowerCase() === String(name).toLowerCase();
  });
}

function getNextDasha(currentName) {
  const index = DASHAS.findIndex(function (dasha) {
    return dasha.name.toLowerCase() === String(currentName).toLowerCase();
  });

  if (index === -1) {
    throw new Error("Unknown dasha lord: " + currentName);
  }

  return DASHAS[(index + 1) % DASHAS.length];
}

function formatDate(dateTime) {
  return dateTime.toFormat("dd/MM/yyyy");
}

function calculateYMDFromDays(totalDays) {
  const years = Math.floor(totalDays / DAYS_PER_YEAR);
  const remainingAfterYears = totalDays - years * DAYS_PER_YEAR;

  const months = Math.floor(remainingAfterYears / (DAYS_PER_YEAR / 12));
  const remainingAfterMonths = remainingAfterYears - months * (DAYS_PER_YEAR / 12);

  const days = Math.round(remainingAfterMonths);

  return {
    years,
    months,
    days
  };
}

function calculateVimshottariDasha(input) {
  const {
    moonLongitude,
    birthLocalDateTimeISO,
    timezone
  } = input;

  const birthDateTime = DateTime.fromISO(birthLocalDateTimeISO, {
    zone: timezone || "Asia/Kolkata"
  });

  if (!birthDateTime.isValid) {
    throw new Error("Invalid birth local date/time for dasha calculation");
  }

  const normalizedMoonLongitude = normalizeDegree(moonLongitude);
  const nakshatraSize = 360 / 27;

  const nakshatraIndex = Math.floor(normalizedMoonLongitude / nakshatraSize);
  const nakshatraStart = nakshatraIndex * nakshatraSize;
  const degreesPassedInNakshatra = normalizedMoonLongitude - nakshatraStart;
  const degreesRemainingInNakshatra = nakshatraSize - degreesPassedInNakshatra;

  const birthDashaLordName = NAKSHATRA_LORDS[nakshatraIndex];
  const birthDasha = getDashaByName(birthDashaLordName);

  if (!birthDasha) {
    throw new Error("Could not find birth dasha lord");
  }

  const balanceFraction = degreesRemainingInNakshatra / nakshatraSize;
  const elapsedFraction = degreesPassedInNakshatra / nakshatraSize;

  const balanceYears = birthDasha.years * balanceFraction;
  const elapsedYears = birthDasha.years * elapsedFraction;

  const balanceDays = balanceYears * DAYS_PER_YEAR;
  const elapsedDays = elapsedYears * DAYS_PER_YEAR;

  const balanceYMD = calculateYMDFromDays(balanceDays);

  /*
    Important display convention:
    The balance calculation still uses precise proportional days.
    But Mahadasha table dates are displayed using calendar-year transitions,
    matching the common AstroSage-style output more closely.

    Example:
    Moon starts 11/10/1987 and runs 10 calendar years,
    so it displays up to 11/10/1997.
  */
  const birthDashaStart = birthDateTime.minus({
    days: elapsedDays
  }).startOf("day");

  const birthDashaEnd = birthDashaStart.plus({
    years: birthDasha.years
  });

  const sequence = [];

  sequence.push({
    lord: birthDasha.name,
    shortName: birthDasha.shortName,
    years: birthDasha.years,
    startDate: formatDate(birthDashaStart),
    endDate: formatDate(birthDashaEnd),
    startISO: birthDashaStart.toISODate(),
    endISO: birthDashaEnd.toISODate(),
    isBirthDasha: true
  });

  let currentDasha = birthDasha;
  let currentStart = birthDashaEnd;

  for (let i = 0; i < 8; i++) {
    currentDasha = getNextDasha(currentDasha.name);

    const currentEnd = currentStart.plus({
      years: currentDasha.years
    });

    sequence.push({
      lord: currentDasha.name,
      shortName: currentDasha.shortName,
      years: currentDasha.years,
      startDate: formatDate(currentStart),
      endDate: formatDate(currentEnd),
      startISO: currentStart.toISODate(),
      endISO: currentEnd.toISODate(),
      isBirthDasha: false
    });

    currentStart = currentEnd;
  }

  return {
    system: "Vimshottari Dasha",
    birthDashaLord: birthDasha.name,
    birthDashaShortName: birthDasha.shortName,
    birthNakshatraIndex: nakshatraIndex + 1,
    moonLongitude: Number(normalizedMoonLongitude.toFixed(4)),
    balanceAtBirth: {
      years: balanceYMD.years,
      months: balanceYMD.months,
      days: balanceYMD.days,
      text: birthDasha.shortName + " " + balanceYMD.years + " Y " + balanceYMD.months + " M " + balanceYMD.days + " D"
    },
    mahadashas: sequence
  };
}

module.exports = {
  calculateVimshottariDasha
};