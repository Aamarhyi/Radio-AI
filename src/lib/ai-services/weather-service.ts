import { WeatherForecast } from '../types';

export class WeatherService {
  /**
   * Fetches weather forecast for a destination during specific dates.
   * Currently uses mock data for MVP.
   */
  async getForecast(destination: string, startDate: string, endDate: string): Promise<WeatherForecast[]> {
    console.log(`Fetching weather for ${destination} from ${startDate} to ${endDate}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const forecasts: WeatherForecast[] = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      
      forecasts.push({
        date: date.toISOString().split('T')[0],
        tempMin: 15 + Math.floor(Math.random() * 5),
        tempMax: 22 + Math.floor(Math.random() * 8),
        condition: Math.random() > 0.8 ? 'Rainy' : 'Sunny',
        description: Math.random() > 0.8 ? 'Occasional showers' : 'Clear blue skies',
        icon: Math.random() > 0.8 ? 'cloud-rain' : 'sun',
        precipitationProbability: Math.random() > 0.8 ? 60 : 10
      });
    }

    return forecasts;
  }

  /**
   * Generates packing recommendations based on weather.
   */
  getPackingRecommendations(forecasts: WeatherForecast[]): string[] {
    const hasRain = forecasts.some(f => f.condition === 'Rainy');
    const minTemp = Math.min(...forecasts.map(f => f.tempMin));
    const maxTemp = Math.max(...forecasts.map(f => f.tempMax));

    const recs = ['Comfortable walking shoes'];
    if (hasRain) recs.push('Umbrella or light raincoat');
    if (minTemp < 15) recs.push('Light jacket or sweater for evenings');
    if (maxTemp > 25) recs.push('Sunscreen and hat');
    
    return recs;
  }

  /**
   * Suggests alternatives for rainy days.
   */
  getRainyDayAlternatives(): any[] {
    return [
      { original: 'Walking Tour', alternative: 'Museum Pass Visit' },
      { original: 'Beach Day', alternative: 'Indoor Spa & Wellness' },
      { original: 'Outdoor Market', alternative: 'Shopping Mall Exploration' }
    ];
  }
}
