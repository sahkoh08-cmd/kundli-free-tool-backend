const CITIES = [
  {
    name: "New Delhi",
    displayName: "New Delhi, Delhi, India",
    country: "India",
    latitude: 28.6139,
    longitude: 77.2090,
    timezone: "Asia/Kolkata"
  },
  {
    name: "Mumbai",
    displayName: "Mumbai, Maharashtra, India",
    country: "India",
    latitude: 19.0760,
    longitude: 72.8777,
    timezone: "Asia/Kolkata"
  },
  {
    name: "Kolkata",
    displayName: "Kolkata, West Bengal, India",
    country: "India",
    latitude: 22.5726,
    longitude: 88.3639,
    timezone: "Asia/Kolkata"
  },
  {
    name: "Chennai",
    displayName: "Chennai, Tamil Nadu, India",
    country: "India",
    latitude: 13.0827,
    longitude: 80.2707,
    timezone: "Asia/Kolkata"
  },
  {
    name: "Bengaluru",
    displayName: "Bengaluru, Karnataka, India",
    country: "India",
    latitude: 12.9716,
    longitude: 77.5946,
    timezone: "Asia/Kolkata"
  },
  {
    name: "Bangalore",
    displayName: "Bangalore, Karnataka, India",
    country: "India",
    latitude: 12.9716,
    longitude: 77.5946,
    timezone: "Asia/Kolkata"
  },
  {
    name: "Hyderabad",
    displayName: "Hyderabad, Telangana, India",
    country: "India",
    latitude: 17.3850,
    longitude: 78.4867,
    timezone: "Asia/Kolkata"
  },
  {
    name: "Ahmedabad",
    displayName: "Ahmedabad, Gujarat, India",
    country: "India",
    latitude: 23.0225,
    longitude: 72.5714,
    timezone: "Asia/Kolkata"
  },
  {
    name: "Pune",
    displayName: "Pune, Maharashtra, India",
    country: "India",
    latitude: 18.5204,
    longitude: 73.8567,
    timezone: "Asia/Kolkata"
  },
  {
    name: "Jaipur",
    displayName: "Jaipur, Rajasthan, India",
    country: "India",
    latitude: 26.9124,
    longitude: 75.7873,
    timezone: "Asia/Kolkata"
  },
  {
    name: "Lucknow",
    displayName: "Lucknow, Uttar Pradesh, India",
    country: "India",
    latitude: 26.8467,
    longitude: 80.9462,
    timezone: "Asia/Kolkata"
  },
  {
    name: "Kanpur",
    displayName: "Kanpur, Uttar Pradesh, India",
    country: "India",
    latitude: 26.4499,
    longitude: 80.3319,
    timezone: "Asia/Kolkata"
  },
  {
    name: "Nagpur",
    displayName: "Nagpur, Maharashtra, India",
    country: "India",
    latitude: 21.1458,
    longitude: 79.0882,
    timezone: "Asia/Kolkata"
  },
  {
    name: "Indore",
    displayName: "Indore, Madhya Pradesh, India",
    country: "India",
    latitude: 22.7196,
    longitude: 75.8577,
    timezone: "Asia/Kolkata"
  },
  {
    name: "Bhopal",
    displayName: "Bhopal, Madhya Pradesh, India",
    country: "India",
    latitude: 23.2599,
    longitude: 77.4126,
    timezone: "Asia/Kolkata"
  },
  {
    name: "Patna",
    displayName: "Patna, Bihar, India",
    country: "India",
    latitude: 25.5941,
    longitude: 85.1376,
    timezone: "Asia/Kolkata"
  },
  {
    name: "Varanasi",
    displayName: "Varanasi, Uttar Pradesh, India",
    country: "India",
    latitude: 25.3176,
    longitude: 82.9739,
    timezone: "Asia/Kolkata"
  },
  {
    name: "Surat",
    displayName: "Surat, Gujarat, India",
    country: "India",
    latitude: 21.1702,
    longitude: 72.8311,
    timezone: "Asia/Kolkata"
  },
  {
    name: "Vadodara",
    displayName: "Vadodara, Gujarat, India",
    country: "India",
    latitude: 22.3072,
    longitude: 73.1812,
    timezone: "Asia/Kolkata"
  },
  {
    name: "Rajkot",
    displayName: "Rajkot, Gujarat, India",
    country: "India",
    latitude: 22.3039,
    longitude: 70.8022,
    timezone: "Asia/Kolkata"
  },
  {
    name: "Ludhiana",
    displayName: "Ludhiana, Punjab, India",
    country: "India",
    latitude: 30.9010,
    longitude: 75.8573,
    timezone: "Asia/Kolkata"
  },
  {
    name: "Amritsar",
    displayName: "Amritsar, Punjab, India",
    country: "India",
    latitude: 31.6340,
    longitude: 74.8723,
    timezone: "Asia/Kolkata"
  },
  {
    name: "Chandigarh",
    displayName: "Chandigarh, India",
    country: "India",
    latitude: 30.7333,
    longitude: 76.7794,
    timezone: "Asia/Kolkata"
  },
  {
    name: "Gurgaon",
    displayName: "Gurgaon, Haryana, India",
    country: "India",
    latitude: 28.4595,
    longitude: 77.0266,
    timezone: "Asia/Kolkata"
  },
  {
    name: "Gurugram",
    displayName: "Gurugram, Haryana, India",
    country: "India",
    latitude: 28.4595,
    longitude: 77.0266,
    timezone: "Asia/Kolkata"
  },
  {
    name: "Noida",
    displayName: "Noida, Uttar Pradesh, India",
    country: "India",
    latitude: 28.5355,
    longitude: 77.3910,
    timezone: "Asia/Kolkata"
  },
  {
    name: "Faridabad",
    displayName: "Faridabad, Haryana, India",
    country: "India",
    latitude: 28.4089,
    longitude: 77.3178,
    timezone: "Asia/Kolkata"
  },
  {
    name: "Ghaziabad",
    displayName: "Ghaziabad, Uttar Pradesh, India",
    country: "India",
    latitude: 28.6692,
    longitude: 77.4538,
    timezone: "Asia/Kolkata"
  },
  {
    name: "Dehradun",
    displayName: "Dehradun, Uttarakhand, India",
    country: "India",
    latitude: 30.3165,
    longitude: 78.0322,
    timezone: "Asia/Kolkata"
  },
  {
    name: "Haridwar",
    displayName: "Haridwar, Uttarakhand, India",
    country: "India",
    latitude: 29.9457,
    longitude: 78.1642,
    timezone: "Asia/Kolkata"
  },
  {
    name: "Rishikesh",
    displayName: "Rishikesh, Uttarakhand, India",
    country: "India",
    latitude: 30.0869,
    longitude: 78.2676,
    timezone: "Asia/Kolkata"
  },
  {
    name: "London",
    displayName: "London, United Kingdom",
    country: "United Kingdom",
    latitude: 51.5072,
    longitude: -0.1276,
    timezone: "Europe/London"
  },
  {
    name: "New York",
    displayName: "New York, United States",
    country: "United States",
    latitude: 40.7128,
    longitude: -74.0060,
    timezone: "America/New_York"
  },
  {
    name: "Los Angeles",
    displayName: "Los Angeles, United States",
    country: "United States",
    latitude: 34.0522,
    longitude: -118.2437,
    timezone: "America/Los_Angeles"
  },
  {
    name: "Toronto",
    displayName: "Toronto, Canada",
    country: "Canada",
    latitude: 43.6532,
    longitude: -79.3832,
    timezone: "America/Toronto"
  },
  {
    name: "Dubai",
    displayName: "Dubai, United Arab Emirates",
    country: "United Arab Emirates",
    latitude: 25.2048,
    longitude: 55.2708,
    timezone: "Asia/Dubai"
  },
  {
    name: "Singapore",
    displayName: "Singapore",
    country: "Singapore",
    latitude: 1.3521,
    longitude: 103.8198,
    timezone: "Asia/Singapore"
  },
  {
    name: "Sydney",
    displayName: "Sydney, Australia",
    country: "Australia",
    latitude: -33.8688,
    longitude: 151.2093,
    timezone: "Australia/Sydney"
  }
];

function searchCities(query) {
  const cleanQuery = String(query || "").trim().toLowerCase();

  if (!cleanQuery) {
    return CITIES.slice(0, 12);
  }

  return CITIES.filter(function (city) {
    return city.name.toLowerCase().includes(cleanQuery) ||
      city.displayName.toLowerCase().includes(cleanQuery) ||
      city.country.toLowerCase().includes(cleanQuery);
  }).slice(0, 20);
}

function findCityByDisplayName(displayName) {
  const cleanDisplayName = String(displayName || "").trim().toLowerCase();

  return CITIES.find(function (city) {
    return city.displayName.toLowerCase() === cleanDisplayName ||
      city.name.toLowerCase() === cleanDisplayName;
  });
}

module.exports = {
  CITIES,
  searchCities,
  findCityByDisplayName
};