import { GeoLocationResult, WeatherData, TemperatureUnit, WindSpeedUnit, CurrentWeather, HourlyWeatherItem, DailyForecastItem } from '../types';
import { generateIntelligenceReport } from '../utils/intelligence';

export const POPULAR_CITIES: GeoLocationResult[] = [
  {
    id: 5128581,
    name: 'New York',
    latitude: 40.71427,
    longitude: -74.00597,
    country_code: 'US',
    country: 'United States',
    admin1: 'New York',
    timezone: 'America/New_York',
  },
  {
    id: 1850147,
    name: 'Tokyo',
    latitude: 35.6895,
    longitude: 139.69171,
    country_code: 'JP',
    country: 'Japan',
    admin1: 'Tokyo',
    timezone: 'Asia/Tokyo',
  },
  {
    id: 2643743,
    name: 'London',
    latitude: 51.50853,
    longitude: -0.12574,
    country_code: 'GB',
    country: 'United Kingdom',
    admin1: 'England',
    timezone: 'Europe/London',
  },
  {
    id: 2988507,
    name: 'Paris',
    latitude: 48.85341,
    longitude: 2.3488,
    country_code: 'FR',
    country: 'France',
    admin1: 'Île-de-France',
    timezone: 'Europe/Paris',
  },
  {
    id: 5391959,
    name: 'San Francisco',
    latitude: 37.77493,
    longitude: -122.41942,
    country_code: 'US',
    country: 'United States',
    admin1: 'California',
    timezone: 'America/Los_Angeles',
  },
  {
    id: 1880252,
    name: 'Singapore',
    latitude: 1.28967,
    longitude: 103.85007,
    country_code: 'SG',
    country: 'Singapore',
    timezone: 'Asia/Singapore',
  },
  {
    id: 2147714,
    name: 'Sydney',
    latitude: -33.86785,
    longitude: 151.20732,
    country_code: 'AU',
    country: 'Australia',
    admin1: 'New South Wales',
    timezone: 'Australia/Sydney',
  },
];

/**
 * Search city using Open-Meteo Geocoding API
 */
export async function searchCities(query: string): Promise<GeoLocationResult[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  const endpoint = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=10&language=en&format=json`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Geocoding service unavailable (HTTP ${response.status})`);
    }

    const data = await response.json();
    if (!data || !data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((r: any) => ({
      id: r.id,
      name: r.name,
      latitude: r.latitude,
      longitude: r.longitude,
      elevation: r.elevation,
      country_code: r.country_code || '',
      country: r.country || '',
      admin1: r.admin1 || '',
      admin2: r.admin2 || '',
      timezone: r.timezone || 'auto',
      population: r.population,
    }));
  } catch (err: any) {
    if (err.message && err.message.includes('HTTP')) {
      throw err;
    }
    throw new Error('Could not connect to the city search service. Please check your internet connection.');
  }
}

/**
 * Fetch weather forecast for coordinates from Open-Meteo Forecast API
 */
export async function fetchWeatherData(
  location: GeoLocationResult,
  tempUnit: TemperatureUnit = 'celsius',
  windUnit: WindSpeedUnit = 'kmh'
): Promise<WeatherData> {
  const tempParam = tempUnit === 'fahrenheit' ? '&temperature_unit=fahrenheit' : '';
  const windParam = windUnit === 'mph' ? '&wind_speed_unit=mph' : '';

  const endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,uv_index&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto${tempParam}${windParam}`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Forecast service error (HTTP ${response.status})`);
    }

    const data = await response.json();
    if (!data || !data.current || !data.daily) {
      throw new Error('Incomplete weather data received from Open-Meteo');
    }

    // Process Current Weather
    const current: CurrentWeather = {
      time: data.current.time,
      temperature: Math.round(data.current.temperature_2m * 10) / 10,
      apparent_temperature: Math.round(data.current.apparent_temperature * 10) / 10,
      is_day: data.current.is_day ?? 1,
      precipitation: data.current.precipitation ?? 0,
      weather_code: data.current.weather_code ?? 0,
      cloud_cover: data.current.cloud_cover ?? 0,
      wind_speed: Math.round(data.current.wind_speed_10m * 10) / 10,
      wind_direction: data.current.wind_direction_10m ?? 0,
      uv_index: Math.round((data.current.uv_index ?? 0) * 10) / 10,
      humidity: Math.round(data.current.relative_humidity_2m ?? 0),
    };

    // Find current index in hourly array to get the next 24-48 hours starting from now
    const currentTimeStr = data.current.time;
    let startIndex = 0;
    if (data.hourly && data.hourly.time) {
      const idx = data.hourly.time.findIndex((t: string) => t >= currentTimeStr.slice(0, 13));
      if (idx !== -1) {
        startIndex = idx;
      }
    }

    // Process next 24 hours of hourly data
    const hourlyLength = Math.min(24, (data.hourly?.time?.length || 0) - startIndex);
    const hourly: HourlyWeatherItem[] = [];

    for (let i = 0; i < hourlyLength; i++) {
      const index = startIndex + i;
      const rawTime = data.hourly.time[index];
      const dateObj = new Date(rawTime);
      
      const formattedHour = index === startIndex 
        ? 'Now' 
        : dateObj.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });

      const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });

      hourly.push({
        time: rawTime,
        formattedHour,
        formattedDate,
        temperature: Math.round(data.hourly.temperature_2m[index]),
        apparent_temperature: Math.round(data.hourly.apparent_temperature ? data.hourly.apparent_temperature[index] : data.hourly.temperature_2m[index]),
        humidity: Math.round(data.hourly.relative_humidity_2m[index] ?? 0),
        precipitation_probability: Math.round(data.hourly.precipitation_probability ? data.hourly.precipitation_probability[index] : 0),
        precipitation: Math.round((data.hourly.precipitation ? data.hourly.precipitation[index] : 0) * 10) / 10,
        weather_code: data.hourly.weather_code[index] ?? 0,
        wind_speed: Math.round(data.hourly.wind_speed_10m[index] ?? 0),
        uv_index: Math.round((data.hourly.uv_index ? data.hourly.uv_index[index] : 0) * 10) / 10,
      });
    }

    // Process 7-day daily forecast
    const dailyCount = Math.min(7, data.daily.time?.length || 0);
    const daily: DailyForecastItem[] = [];

    for (let i = 0; i < dailyCount; i++) {
      const rawDate = data.daily.time[i];
      const dateObj = new Date(`${rawDate}T00:00:00`);
      
      let formattedDay = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      if (i === 0) formattedDay = 'Today';
      else if (i === 1) formattedDay = 'Tomorrow';

      const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      daily.push({
        date: rawDate,
        formattedDay,
        formattedDate,
        weather_code: data.daily.weather_code[i] ?? 0,
        temperature_max: Math.round(data.daily.temperature_2m_max[i]),
        temperature_min: Math.round(data.daily.temperature_2m_min[i]),
        apparent_temperature_max: Math.round(data.daily.apparent_temperature_max ? data.daily.apparent_temperature_max[i] : data.daily.temperature_2m_max[i]),
        apparent_temperature_min: Math.round(data.daily.apparent_temperature_min ? data.daily.apparent_temperature_min[i] : data.daily.temperature_2m_min[i]),
        precipitation_sum: Math.round((data.daily.precipitation_sum ? data.daily.precipitation_sum[i] : 0) * 10) / 10,
        precipitation_probability_max: Math.round(data.daily.precipitation_probability_max ? data.daily.precipitation_probability_max[i] : 0),
        wind_speed_max: Math.round(data.daily.wind_speed_10m_max ? data.daily.wind_speed_10m_max[i] : 0),
        uv_index_max: Math.round((data.daily.uv_index_max ? data.daily.uv_index_max[i] : 0) * 10) / 10,
        sunrise: data.daily.sunrise ? data.daily.sunrise[i] : '',
        sunset: data.daily.sunset ? data.daily.sunset[i] : '',
      });
    }

    // Generate Intelligence Report
    const intelligence = generateIntelligenceReport(current, hourly, daily, tempUnit);

    return {
      location,
      current,
      hourly,
      daily,
      intelligence,
      units: {
        temperature: tempUnit,
        windSpeed: windUnit,
      },
      lastUpdated: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
  } catch (err: any) {
    if (err.message && err.message.includes('HTTP')) {
      throw err;
    }
    throw new Error('Failed to fetch weather forecast. Please check coordinates or try again later.');
  }
}
