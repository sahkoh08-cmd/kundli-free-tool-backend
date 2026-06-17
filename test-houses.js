const sweph = require("sweph");

console.log("Checking house calculation functions...");
console.log("houses:", typeof sweph.houses);
console.log("houses_ex:", typeof sweph.houses_ex);

const year = 1995;
const month = 8;
const day = 15;
const utcHour = 9; // 14:30 India time minus 5.5 hours

const latitude = 28.6139;
const longitude = 77.2090;

const julianDay = sweph.julday(year, month, day, utcHour, 1);

console.log("Julian Day:", julianDay);

const flags = 2 + 256 + 65536;

if (typeof sweph.set_sid_mode === "function") {
  sweph.set_sid_mode(1, 0, 0);
}

function tryHouseCalculation(label, callback) {
  try {
    console.log("\nTrying:", label);
    const result = callback();
    console.log("Success:");
    console.log(result);
  } catch (error) {
    console.log("Failed:");
    console.log(error.message);
  }
}

if (typeof sweph.houses_ex === "function") {
  tryHouseCalculation("houses_ex with W string", function () {
    return sweph.houses_ex(julianDay, flags, latitude, longitude, "W");
  });

  tryHouseCalculation("houses_ex with 87 number", function () {
    return sweph.houses_ex(julianDay, flags, latitude, longitude, 87);
  });
}

if (typeof sweph.houses === "function") {
  tryHouseCalculation("houses with W string", function () {
    return sweph.houses(julianDay, latitude, longitude, "W");
  });

  tryHouseCalculation("houses with 87 number", function () {
    return sweph.houses(julianDay, latitude, longitude, 87);
  });
}