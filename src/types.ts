export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'mph';

export interface GeoLocationResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code: string;
  country: string;
  country_id?: number;
  admin1?: string;
  admin2?: string;
  timezone: string;
  population?: number;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  weather_code: number;
  cloud_cover: number;
  wind_speed: number;
  wind_direction: number;
  uv_index: number;
  humidity: number;
}

export interface HourlyWeatherItem {
  time: string;
  formattedHour: string;
  formattedDate: string;
  temperature: number;
  apparent_temperature: number;
  humidity: number;
  precipitation_probability: number;
  precipitation: number;
  weather_code: number;
  wind_speed: number;
  uv_index: number;
}

export interface DailyForecastItem {
  date: string;
  formattedDay: string;
  formattedDate: string;
  weather_code: number;
  temperature_max: number;
  temperature_min: number;
  apparent_temperature_max: number;
  apparent_temperature_min: number;
  precipitation_sum: number;
  precipitation_probability_max: number;
  wind_speed_max: number;
  uv_index_max: number;
  sunrise: string;
  sunset: string;
}

export interface IntelligenceItem {
  title: string;
  status: 'good' | 'moderate' | 'caution' | 'alert';
  headline: string;
  description: string;
  iconName: string;
  score?: number;
}

export interface WeatherIntelligenceReport {
  overallActivityScore: number; // 0 - 100
  overallActivityLabel: 'Optimal' | 'Favorable' | 'Moderate' | 'Challenging' | 'Poor';
  umbrellaNeeded: boolean;
  umbrellaChance: number;
  umbrellaAdvice: string;
  attireRecommendation: string;
  layerDetails: string;
  uvLevel: string;
  uvValue: number;
  uvAdvice: string;
  outdoorWindow: string;
  commuteAdvice: string;
  cardHighlights: IntelligenceItem[];
}

export interface WeatherData {
  location: GeoLocationResult;
  current: CurrentWeather;
  hourly: HourlyWeatherItem[];
  daily: DailyForecastItem[];
  intelligence: WeatherIntelligenceReport;
  units: {
    temperature: TemperatureUnit;
    windSpeed: WindSpeedUnit;
  };
  lastUpdated: string;
}
