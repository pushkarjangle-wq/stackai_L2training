import React from 'react';
import {
  Sun,
  SunMedium,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudHail,
  CloudSnow,
  Snowflake,
  CloudLightning,
  CloudRainWind,
  Wind,
  Droplets,
  Eye,
  Thermometer,
  Compass,
  Umbrella,
  Shirt,
  Activity,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface WeatherIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ name, className = 'w-6 h-6', size }) => {
  const iconProps = { className, size };

  switch (name) {
    case 'Sun':
      return <Sun {...iconProps} />;
    case 'SunMedium':
      return <SunMedium {...iconProps} />;
    case 'Moon':
      return <Moon {...iconProps} />;
    case 'Cloud':
      return <Cloud {...iconProps} />;
    case 'CloudSun':
      return <CloudSun {...iconProps} />;
    case 'CloudMoon':
      return <CloudMoon {...iconProps} />;
    case 'CloudFog':
      return <CloudFog {...iconProps} />;
    case 'CloudDrizzle':
      return <CloudDrizzle {...iconProps} />;
    case 'CloudRain':
      return <CloudRain {...iconProps} />;
    case 'CloudHail':
      return <CloudHail {...iconProps} />;
    case 'CloudSnow':
      return <CloudSnow {...iconProps} />;
    case 'Snowflake':
      return <Snowflake {...iconProps} />;
    case 'CloudLightning':
      return <CloudLightning {...iconProps} />;
    case 'CloudRainWind':
      return <CloudRainWind {...iconProps} />;
    case 'Wind':
      return <Wind {...iconProps} />;
    case 'Droplets':
      return <Droplets {...iconProps} />;
    case 'Eye':
      return <Eye {...iconProps} />;
    case 'Thermometer':
      return <Thermometer {...iconProps} />;
    case 'Compass':
      return <Compass {...iconProps} />;
    case 'Umbrella':
      return <Umbrella {...iconProps} />;
    case 'Shirt':
      return <Shirt {...iconProps} />;
    case 'Activity':
      return <Activity {...iconProps} />;
    case 'Flame':
      return <Flame {...iconProps} />;
    case 'CheckCircle2':
      return <CheckCircle2 {...iconProps} />;
    case 'AlertTriangle':
      return <AlertTriangle {...iconProps} />;
    default:
      return <Cloud {...iconProps} />;
  }
};
