export interface WeatherCodeInfo {
  code: number;
  label: string;
  iconName: string; // Used to pick appropriate Lucide icon
  accentColor: string;
  textColor: string;
  bgGradient: string;
  category: 'clear' | 'cloudy' | 'rain' | 'snow' | 'thunder' | 'fog';
}

export function getWeatherCodeInfo(code: number, isDay = 1): WeatherCodeInfo {
  switch (code) {
    case 0:
      return {
        code,
        label: isDay ? 'Clear Sky' : 'Clear Night',
        iconName: isDay ? 'Sun' : 'Moon',
        accentColor: 'from-amber-400/20 to-orange-400/20',
        textColor: isDay ? 'text-amber-500' : 'text-indigo-600',
        bgGradient: isDay
          ? 'from-sky-50 via-blue-50/70 to-amber-50/50 border-sky-200'
          : 'from-slate-50 via-indigo-50/50 to-slate-100 border-slate-200',
        category: 'clear',
      };
    case 1:
      return {
        code,
        label: isDay ? 'Mainly Clear' : 'Mainly Clear Night',
        iconName: isDay ? 'SunMedium' : 'Moon',
        accentColor: 'from-amber-400/20 to-sky-400/20',
        textColor: isDay ? 'text-amber-600' : 'text-indigo-600',
        bgGradient: 'from-sky-50 via-slate-50 to-blue-50/40 border-sky-200',
        category: 'clear',
      };
    case 2:
      return {
        code,
        label: 'Partly Cloudy',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        accentColor: 'from-sky-400/20 to-slate-400/20',
        textColor: 'text-sky-600',
        bgGradient: 'from-slate-50 via-sky-50/50 to-slate-100 border-slate-200',
        category: 'cloudy',
      };
    case 3:
      return {
        code,
        label: 'Overcast',
        iconName: 'Cloud',
        accentColor: 'from-slate-400/20 to-slate-500/20',
        textColor: 'text-slate-600',
        bgGradient: 'from-slate-100/90 via-slate-50 to-slate-100 border-slate-200',
        category: 'cloudy',
      };
    case 45:
      return {
        code,
        label: 'Foggy',
        iconName: 'CloudFog',
        accentColor: 'from-slate-400/20 to-teal-400/20',
        textColor: 'text-teal-600',
        bgGradient: 'from-slate-50 via-teal-50/40 to-slate-100 border-teal-200',
        category: 'fog',
      };
    case 48:
      return {
        code,
        label: 'Depositing Rime Fog',
        iconName: 'CloudFog',
        accentColor: 'from-teal-400/20 to-cyan-400/20',
        textColor: 'text-teal-700',
        bgGradient: 'from-slate-50 via-teal-50/50 to-slate-100 border-teal-200',
        category: 'fog',
      };
    case 51:
      return {
        code,
        label: 'Light Drizzle',
        iconName: 'CloudDrizzle',
        accentColor: 'from-sky-400/20 to-cyan-400/20',
        textColor: 'text-cyan-700',
        bgGradient: 'from-sky-50 via-slate-50 to-blue-50/40 border-sky-200',
        category: 'rain',
      };
    case 53:
      return {
        code,
        label: 'Moderate Drizzle',
        iconName: 'CloudDrizzle',
        accentColor: 'from-cyan-400/20 to-blue-400/20',
        textColor: 'text-blue-600',
        bgGradient: 'from-cyan-50 via-slate-50 to-blue-50/50 border-cyan-200',
        category: 'rain',
      };
    case 55:
      return {
        code,
        label: 'Dense Drizzle',
        iconName: 'CloudRain',
        accentColor: 'from-blue-400/20 to-indigo-400/20',
        textColor: 'text-blue-700',
        bgGradient: 'from-blue-50 via-slate-50 to-indigo-50/40 border-blue-200',
        category: 'rain',
      };
    case 56:
    case 57:
      return {
        code,
        label: 'Freezing Drizzle',
        iconName: 'CloudHail',
        accentColor: 'from-cyan-400/20 to-indigo-400/20',
        textColor: 'text-cyan-800',
        bgGradient: 'from-cyan-50 via-blue-50/40 to-slate-50 border-cyan-200',
        category: 'snow',
      };
    case 61:
      return {
        code,
        label: 'Slight Rain',
        iconName: 'CloudRain',
        accentColor: 'from-sky-400/20 to-blue-500/20',
        textColor: 'text-sky-600',
        bgGradient: 'from-sky-50 via-blue-50/50 to-slate-50 border-sky-200',
        category: 'rain',
      };
    case 63:
      return {
        code,
        label: 'Moderate Rain',
        iconName: 'CloudRain',
        accentColor: 'from-blue-400/20 to-indigo-500/20',
        textColor: 'text-blue-600',
        bgGradient: 'from-blue-50 via-sky-50 to-indigo-50/40 border-blue-200',
        category: 'rain',
      };
    case 65:
      return {
        code,
        label: 'Heavy Rain',
        iconName: 'CloudRain',
        accentColor: 'from-indigo-500/25 to-blue-600/25',
        textColor: 'text-indigo-600',
        bgGradient: 'from-indigo-50 via-blue-50 to-slate-100 border-indigo-200',
        category: 'rain',
      };
    case 66:
    case 67:
      return {
        code,
        label: 'Freezing Rain',
        iconName: 'CloudHail',
        accentColor: 'from-cyan-500/20 to-blue-500/20',
        textColor: 'text-cyan-800',
        bgGradient: 'from-slate-50 via-cyan-50/50 to-slate-100 border-cyan-200',
        category: 'snow',
      };
    case 71:
      return {
        code,
        label: 'Slight Snow',
        iconName: 'CloudSnow',
        accentColor: 'from-blue-300/20 to-slate-300/20',
        textColor: 'text-sky-700',
        bgGradient: 'from-slate-50 via-blue-50/40 to-slate-100 border-blue-200',
        category: 'snow',
      };
    case 73:
      return {
        code,
        label: 'Moderate Snow',
        iconName: 'CloudSnow',
        accentColor: 'from-slate-300/20 to-cyan-400/20',
        textColor: 'text-cyan-700',
        bgGradient: 'from-slate-50 via-cyan-50/50 to-slate-100 border-cyan-200',
        category: 'snow',
      };
    case 75:
      return {
        code,
        label: 'Heavy Snow',
        iconName: 'Snowflake',
        accentColor: 'from-slate-200/20 to-sky-400/20',
        textColor: 'text-sky-800',
        bgGradient: 'from-sky-50 via-slate-50 to-blue-50/50 border-sky-300',
        category: 'snow',
      };
    case 77:
      return {
        code,
        label: 'Snow Grains',
        iconName: 'Snowflake',
        accentColor: 'from-sky-400/20 to-blue-400/20',
        textColor: 'text-sky-700',
        bgGradient: 'from-slate-50 via-blue-50/40 to-slate-100 border-sky-200',
        category: 'snow',
      };
    case 80:
      return {
        code,
        label: 'Slight Rain Showers',
        iconName: 'CloudDrizzle',
        accentColor: 'from-sky-400/20 to-indigo-400/20',
        textColor: 'text-sky-600',
        bgGradient: 'from-sky-50 via-slate-50 to-indigo-50/40 border-sky-200',
        category: 'rain',
      };
    case 81:
      return {
        code,
        label: 'Moderate Showers',
        iconName: 'CloudRain',
        accentColor: 'from-blue-400/20 to-sky-500/20',
        textColor: 'text-blue-600',
        bgGradient: 'from-blue-50 via-slate-50 to-sky-50/50 border-blue-200',
        category: 'rain',
      };
    case 82:
      return {
        code,
        label: 'Violent Showers',
        iconName: 'CloudRainWind',
        accentColor: 'from-blue-500/30 to-violet-500/30',
        textColor: 'text-indigo-600',
        bgGradient: 'from-indigo-50 via-blue-50/60 to-slate-100 border-indigo-200',
        category: 'rain',
      };
    case 85:
    case 86:
      return {
        code,
        label: 'Snow Showers',
        iconName: 'CloudSnow',
        accentColor: 'from-blue-400/20 to-slate-400/20',
        textColor: 'text-sky-700',
        bgGradient: 'from-slate-50 via-blue-50/50 to-slate-100 border-blue-200',
        category: 'snow',
      };
    case 95:
      return {
        code,
        label: 'Thunderstorm',
        iconName: 'CloudLightning',
        accentColor: 'from-amber-400/20 to-purple-500/20',
        textColor: 'text-amber-600',
        bgGradient: 'from-purple-50/60 via-amber-50/40 to-slate-100 border-amber-200',
        category: 'thunder',
      };
    case 96:
    case 99:
      return {
        code,
        label: 'Thunderstorm with Hail',
        iconName: 'CloudLightning',
        accentColor: 'from-red-400/20 to-purple-500/30',
        textColor: 'text-amber-700',
        bgGradient: 'from-rose-50/60 via-purple-50/40 to-slate-100 border-rose-200',
        category: 'thunder',
      };
    default:
      return {
        code,
        label: 'Fair Conditions',
        iconName: 'Cloud',
        accentColor: 'from-slate-400/20 to-slate-500/20',
        textColor: 'text-slate-600',
        bgGradient: 'from-slate-50 via-white to-slate-100 border-slate-200',
        category: 'clear',
      };
  }
}
