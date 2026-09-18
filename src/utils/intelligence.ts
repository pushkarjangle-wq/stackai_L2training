import { CurrentWeather, DailyForecastItem, HourlyWeatherItem, WeatherIntelligenceReport, IntelligenceItem, TemperatureUnit } from '../types';

export function generateIntelligenceReport(
  current: CurrentWeather,
  hourly: HourlyWeatherItem[],
  daily: DailyForecastItem[],
  unit: TemperatureUnit
): WeatherIntelligenceReport {
  // Convert current temp to celsius for standard threshold calculations
  const tempC = unit === 'fahrenheit' 
    ? (current.temperature - 32) * (5 / 9) 
    : current.temperature;
  const apparentTempC = unit === 'fahrenheit' 
    ? (current.apparent_temperature - 32) * (5 / 9) 
    : current.apparent_temperature;

  // Next 12 hours slice
  const next12Hours = hourly.slice(0, 12);
  const maxPrecipProb12h = next12Hours.length > 0 
    ? Math.max(...next12Hours.map((h) => h.precipitation_probability)) 
    : current.precipitation > 0 ? 90 : 0;
  
  const maxWind12h = next12Hours.length > 0
    ? Math.max(...next12Hours.map((h) => h.wind_speed))
    : current.wind_speed;

  // 1. Calculate Activity Score (0 - 100)
  let score = 100;

  // Temperature penalties
  if (tempC < 5) {
    score -= Math.min(45, (5 - tempC) * 3);
  } else if (tempC > 27) {
    score -= Math.min(45, (tempC - 27) * 4);
  } else if (tempC >= 18 && tempC <= 23) {
    // Sweet spot bonus
    score += 5;
  }

  // Rain penalties
  if (current.precipitation > 2) {
    score -= 40;
  } else if (current.precipitation > 0) {
    score -= 25;
  } else if (maxPrecipProb12h > 60) {
    score -= 30;
  } else if (maxPrecipProb12h > 30) {
    score -= 15;
  }

  // Wind penalties (km/h)
  if (current.wind_speed > 40) {
    score -= 35;
  } else if (current.wind_speed > 25) {
    score -= 15;
  }

  // UV penalty if extreme
  if (current.uv_index >= 8) {
    score -= 10;
  }

  score = Math.max(10, Math.min(100, Math.round(score)));

  let label: WeatherIntelligenceReport['overallActivityLabel'] = 'Optimal';
  if (score >= 85) label = 'Optimal';
  else if (score >= 70) label = 'Favorable';
  else if (score >= 50) label = 'Moderate';
  else if (score >= 35) label = 'Challenging';
  else label = 'Poor';

  // 2. Umbrella Index
  const umbrellaNeeded = maxPrecipProb12h >= 35 || current.precipitation > 0;
  let umbrellaAdvice = 'No umbrella needed today. Clear skies ahead.';
  if (current.precipitation > 0) {
    umbrellaAdvice = 'Active precipitation detected. Grab a waterproof umbrella and rain jacket.';
  } else if (maxPrecipProb12h >= 65) {
    umbrellaAdvice = `High rain likelihood (${maxPrecipProb12h}% chance). Pack an umbrella before heading out.`;
  } else if (maxPrecipProb12h >= 35) {
    umbrellaAdvice = `Moderate shower risk (${maxPrecipProb12h}% chance). Keep a compact umbrella handy.`;
  }

  // 3. Attire Recommendation
  let attireRecommendation = 'Comfortable light layers';
  let layerDetails = 'T-shirt or blouse with light trousers';
  if (apparentTempC < 0) {
    attireRecommendation = 'Heavy winter insulation';
    layerDetails = 'Thermal base layer, wool sweater, insulated parka, gloves, and warm beanie.';
  } else if (apparentTempC < 10) {
    attireRecommendation = 'Warm outer coat';
    layerDetails = 'Warm fleece or sweater under an insulated winter jacket, scarf recommended.';
  } else if (apparentTempC < 17) {
    attireRecommendation = 'Mid-season jacket';
    layerDetails = 'Long-sleeve shirt paired with a trench coat, windbreaker, or light wool cardigan.';
  } else if (apparentTempC < 24) {
    attireRecommendation = 'Comfortable single layer';
    layerDetails = 'Breathable cotton t-shirt, polo, or light button-down with jeans or chinos.';
  } else if (apparentTempC < 30) {
    attireRecommendation = 'Light summer clothing';
    layerDetails = 'Shorts, linen shirt, or breathable activewear. Stay hydrated.';
  } else {
    attireRecommendation = 'Minimal ultralight fabrics';
    layerDetails = 'Loose, light-colored UV-protective apparel, sunglasses, and sun hat.';
  }

  // 4. UV Protection
  const uvValue = current.uv_index;
  let uvLevel = 'Low';
  let uvAdvice = 'Minimal sun protection required. Safe for extended exposure.';
  if (uvValue >= 11) {
    uvLevel = 'Extreme';
    uvAdvice = 'Avoid direct sun exposure between 10am-4pm. Broad spectrum SPF 50+, hat, and sunglasses mandatory.';
  } else if (uvValue >= 8) {
    uvLevel = 'Very High';
    uvAdvice = 'High risk of skin damage. Seek shade, wear protective clothing, and apply SPF 50+.';
  } else if (uvValue >= 6) {
    uvLevel = 'High';
    uvAdvice = 'Sun protection needed. Wear sunglasses, a wide-brim hat, and SPF 30+.';
  } else if (uvValue >= 3) {
    uvLevel = 'Moderate';
    uvAdvice = 'Moderate UV radiation. Apply sunscreen if outdoors during midday peak hours.';
  }

  // 5. Best Outdoor Window
  let bestWindow = 'Mid-morning or late afternoon';
  if (next12Hours.length >= 3) {
    // Find consecutive 3-hour window with lowest rain prob and closest to 20°C
    let bestWindowIdx = 0;
    let bestWindowScore = -999;
    for (let i = 0; i <= next12Hours.length - 3; i++) {
      const slice = next12Hours.slice(i, i + 3);
      const avgRain = slice.reduce((acc, h) => acc + h.precipitation_probability, 0) / 3;
      const avgTemp = slice.reduce((acc, h) => acc + h.temperature, 0) / 3;
      const avgTempC = unit === 'fahrenheit' ? (avgTemp - 32) * (5 / 9) : avgTemp;
      const tempDiff = Math.abs(avgTempC - 21);
      
      const windowScore = 100 - (avgRain * 1.2) - (tempDiff * 4);
      if (windowScore > bestWindowScore) {
        bestWindowScore = windowScore;
        bestWindowIdx = i;
      }
    }
    const startHour = next12Hours[bestWindowIdx]?.formattedHour || 'Now';
    const endHour = next12Hours[Math.min(next12Hours.length - 1, bestWindowIdx + 3)]?.formattedHour || 'Later';
    bestWindow = `${startHour} - ${endHour} (Lowest rain risk & comfortable conditions)`;
  }

  // 6. Commute Advice
  let commuteAdvice = 'Roads and transit paths are optimal.';
  if (current.precipitation > 2 || maxPrecipProb12h > 70) {
    commuteAdvice = 'Wet road conditions and possible spray. Allow extra travel time.';
  } else if (current.wind_speed > 35) {
    commuteAdvice = 'Strong wind gusts may affect cycling, bridge transit, and high-sided vehicles.';
  } else if (tempC < 1) {
    commuteAdvice = 'Watch for black ice patches on bridges and early-morning shaded streets.';
  }

  // Card highlights for visual intelligence grid
  const cardHighlights: IntelligenceItem[] = [
    {
      title: 'Outdoor Activity',
      status: score >= 75 ? 'good' : score >= 50 ? 'moderate' : 'caution',
      headline: `${label} (${score}/100)`,
      description: score >= 75 ? 'Great conditions for running, cycling, and walks.' : score >= 50 ? 'Acceptable conditions with light precautions.' : 'Consider indoor training or activities today.',
      iconName: 'Activity',
      score,
    },
    {
      title: 'Rain & Umbrella',
      status: umbrellaNeeded ? (maxPrecipProb12h > 60 ? 'alert' : 'caution') : 'good',
      headline: umbrellaNeeded ? 'Umbrella Advised' : 'No Rain Expected',
      description: umbrellaAdvice,
      iconName: umbrellaNeeded ? 'Umbrella' : 'Sun',
    },
    {
      title: 'Attire & Layers',
      status: 'good',
      headline: attireRecommendation,
      description: layerDetails,
      iconName: 'Shirt',
    },
    {
      title: 'Solar & UV Index',
      status: uvValue >= 8 ? 'alert' : uvValue >= 6 ? 'caution' : 'good',
      headline: `UV ${uvValue.toFixed(1)} (${uvLevel})`,
      description: uvAdvice,
      iconName: 'SunMedium',
    },
  ];

  return {
    overallActivityScore: score,
    overallActivityLabel: label,
    umbrellaNeeded,
    umbrellaChance: maxPrecipProb12h,
    umbrellaAdvice,
    attireRecommendation,
    layerDetails,
    uvLevel,
    uvValue,
    uvAdvice,
    outdoorWindow: bestWindow,
    commuteAdvice,
    cardHighlights,
  };
}
