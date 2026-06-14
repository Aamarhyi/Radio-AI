import { getWeatherForecast } from './ai-integration';

export interface WeatherData {
  temp_high: number;
  temp_low: number;
  condition: string;
  icon: string;
  humidity: number;
  precipitation_chance: number;
}

/**
 * Service to handle weather retrieval for destinations and specific travel dates.
 * Delegates to the AI integration bridge for optimized data.
 */
export class WeatherService {
  private static API_KEY = process.env.WEATHER_API_KEY || '';

  /**
   * Fetches weather information for a specific destination and date range.
   */
  public static async getWeatherForDestination(
    destination: string,
    startDate?: string,
    endDate?: string
  ): Promise<Record<string, WeatherData>> {
    try {
      const forecast = await getWeatherForecast(destination, startDate || '', endDate || '');
      
      if (forecast && forecast.length > 0) {
        const weatherResult: Record<string, WeatherData> = {};
        forecast.forEach((f: any) => {
          weatherResult[f.date] = {
            temp_high: f.tempMax,
            temp_low: f.tempMin,
            condition: f.condition,
            icon: f.icon,
            humidity: 70, // Default for now
            precipitation_chance: f.precipitationProbability,
          };
        });
        return weatherResult;
      }
    } catch (error) {
      console.error('Error fetching from AI weather service, falling back to local mock:', error);
    }

    const weatherResult: Record<string, WeatherData> = {};
    const dates = this.getDateRangeArray(startDate, endDate);

    // Default Smart Climatology Mock fallback
    for (const dateStr of dates) {
      weatherResult[dateStr] = this.getMockWeather(destination, dateStr);
    }

    return weatherResult;
  }

  /**
   * Generates localized climatology weather mock based on destination name and month.
   */
  public static getMockWeather(destination: string, dateStr: string): WeatherData {
    const date = new Date(dateStr);
    const month = isNaN(date.getTime()) ? new Date().getMonth() : date.getMonth(); // 0-11
    const destLower = destination.toLowerCase();

    // Default values (temperate zone)
    let temp_high = 20;
    let temp_low = 10;
    let condition = 'Partly Cloudy';
    let icon = 'cloudy';
    let humidity = 65;
    let precipitation_chance = 20;

    // Region-based heuristic climate profiles
    if (destLower.includes('tokyo') || destLower.includes('japan')) {
      if (month >= 5 && month <= 8) { // Summer
        temp_high = 29; temp_low = 22; condition = 'Humid and Sunny'; icon = 'sunny'; humidity = 80; precipitation_chance = 40;
      } else if (month >= 11 || month <= 1) { // Winter
        temp_high = 10; temp_low = 2; condition = 'Clear and Cold'; icon = 'clear'; humidity = 50; precipitation_chance = 10;
      } else { // Spring / Autumn
        temp_high = 18; temp_low = 10; condition = 'Mild and Pleasant'; icon = 'partly-cloudy'; humidity = 60; precipitation_chance = 25;
      }
    } else if (destLower.includes('london') || destLower.includes('uk') || destLower.includes('england')) {
      humidity = 80;
      if (month >= 5 && month <= 8) {
        temp_high = 22; temp_low = 13; condition = 'Mostly Sunny'; icon = 'sunny'; precipitation_chance = 30;
      } else if (month >= 11 || month <= 1) {
        temp_high = 8; temp_low = 3; condition = 'Overcast and Drizzle'; icon = 'rain'; precipitation_chance = 60;
      } else {
        temp_high = 14; temp_low = 7; condition = 'Showers'; icon = 'rain'; precipitation_chance = 45;
      }
    } else if (destLower.includes('paris') || destLower.includes('france') || destLower.includes('europe')) {
      if (month >= 5 && month <= 8) {
        temp_high = 25; temp_low = 15; condition = 'Clear and Warm'; icon = 'sunny'; humidity = 60; precipitation_chance = 20;
      } else if (month >= 11 || month <= 1) {
        temp_high = 7; temp_low = 3; condition = 'Chilly and Cloudy'; icon = 'cloudy'; humidity = 80; precipitation_chance = 40;
      } else {
        temp_high = 16; temp_low = 8; condition = 'Partly Cloudy'; icon = 'partly-cloudy'; humidity = 70; precipitation_chance = 30;
      }
    } else if (destLower.includes('bali') || destLower.includes('hawaii') || destLower.includes('phuket') || destLower.includes('tropical')) {
      // Tropical profile: warm all year, rainy/dry seasons
      temp_high = 31;
      temp_low = 24;
      humidity = 85;
      if (month >= 10 || month <= 3) { // Wet season
        condition = 'Tropical Thunderstorms'; icon = 'thunderstorm'; precipitation_chance = 75;
      } else { // Dry season
        condition = 'Sunny and Humid'; icon = 'sunny'; precipitation_chance = 15;
      }
    } else if (destLower.includes('reykjavik') || destLower.includes('iceland')) {
      // Subarctic profile
      if (month >= 5 && month <= 8) {
        temp_high = 13; temp_low = 8; condition = 'Cool and Cloudy'; icon = 'cloudy'; humidity = 75; precipitation_chance = 40;
      } else {
        temp_high = 2; temp_low = -3; condition = 'Light Snow'; icon = 'snow'; humidity = 85; precipitation_chance = 50;
      }
    }

    return {
      temp_high,
      temp_low,
      condition,
      icon,
      humidity,
      precipitation_chance,
    };
  }

  /**
   * Helper to generate a range of ISO date strings between start and end dates.
   */
  private static getDateRangeArray(startDateStr?: string, endDateStr?: string): string[] {
    if (!startDateStr) {
      // Return today's date plus 4 days as default 5-day trip
      const dates: string[] = [];
      const baseDate = new Date();
      for (let i = 0; i < 5; i++) {
        const d = new Date(baseDate);
        d.setDate(baseDate.getDate() + i);
        dates.push(d.toISOString().split('T')[0]);
      }
      return dates;
    }

    const start = new Date(startDateStr);
    const end = endDateStr ? new Date(endDateStr) : new Date(start);
    
    // Safety cap: max 30 days
    const maxDays = 30;
    const dates: string[] = [];
    const current = new Date(start);

    for (let i = 0; i < maxDays; i++) {
      dates.push(current.toISOString().split('T')[0]);
      if (current.toISOString().split('T')[0] === end.toISOString().split('T')[0]) {
        break;
      }
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }
}
