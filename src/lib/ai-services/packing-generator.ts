import { PackingList, PackingItem, WeatherForecast } from '../types';

export class PackingListGenerator {
  /**
   * Generates a comprehensive packing list based on trip details.
   */
  generatePackingList(tripId: string, destination: string, durationDays: number, activities: any[], forecasts: WeatherForecast[]): PackingList {
    const items: PackingItem[] = [];

    // Basic Essentials
    this.addBasicEssentials(items, durationDays);

    // Activity-based items
    this.addActivityItems(items, activities);

    // Weather-based items
    this.addWeatherItems(items, forecasts);

    return {
      tripId,
      items
    };
  }

  private addBasicEssentials(items: PackingItem[], days: number) {
    items.push({ name: 'Passport/ID', category: 'documents', essential: true, packed: false, quantity: 1 });
    items.push({ name: 'Travel Insurance Docs', category: 'documents', essential: true, packed: false, quantity: 1 });
    items.push({ name: 'Phone Charger', category: 'electronics', essential: true, packed: false, quantity: 1 });
    items.push({ name: 'Portable Power Bank', category: 'electronics', essential: false, packed: false, quantity: 1 });
    items.push({ name: 'Underwear', category: 'clothing', essential: true, packed: false, quantity: days + 1 });
    items.push({ name: 'Socks', category: 'clothing', essential: true, packed: false, quantity: days + 1 });
    items.push({ name: 'T-shirts', category: 'clothing', essential: true, packed: false, quantity: Math.ceil(days / 1.5) });
    items.push({ name: 'Toothbrush & Paste', category: 'toiletries', essential: true, packed: false, quantity: 1 });
    items.push({ name: 'Shampoo & Conditioner', category: 'toiletries', essential: true, packed: false, quantity: 1 });
    items.push({ name: 'Deodorant', category: 'toiletries', essential: true, packed: false, quantity: 1 });
  }

  private addActivityItems(items: PackingItem[], activities: any[]) {
    // Unique activity categories
    const categories = new Set(activities.map(a => a.category));
    
    if (categories.has('Nature') || categories.has('Adventure')) {
      items.push({ name: 'Hiking Boots', category: 'clothing', essential: false, packed: false, quantity: 1 });
      items.push({ name: 'Reusable Water Bottle', category: 'miscellaneous', essential: true, packed: false, quantity: 1 });
      items.push({ name: 'Daypack', category: 'miscellaneous', essential: false, packed: false, quantity: 1 });
    }

    if (categories.has('Food') || categories.has('Nightlife') || categories.has('Culture')) {
      items.push({ name: 'Smart Casual Outfit', category: 'clothing', essential: false, packed: false, quantity: 2 });
    }

    if (categories.has('Photography')) {
      items.push({ name: 'Camera & SD Cards', category: 'electronics', essential: false, packed: false, quantity: 1 });
    }
  }

  private addWeatherItems(items: PackingItem[], forecasts: WeatherForecast[]) {
    const hasRain = forecasts.some(f => f.condition === 'Rainy');
    const maxTemp = Math.max(...forecasts.map(f => f.tempMax));
    const minTemp = Math.min(...forecasts.map(f => f.tempMin));

    if (hasRain) {
      items.push({ name: 'Compact Umbrella', category: 'miscellaneous', essential: false, packed: false, quantity: 1 });
      items.push({ name: 'Light Rain Jacket', category: 'clothing', essential: false, packed: false, quantity: 1 });
    }
    
    if (maxTemp > 25) {
      items.push({ name: 'Swimwear', category: 'clothing', essential: false, packed: false, quantity: 1 });
      items.push({ name: 'Sunglasses', category: 'miscellaneous', essential: true, packed: false, quantity: 1 });
      items.push({ name: 'Sunscreen', category: 'health', essential: true, packed: false, quantity: 1 });
      items.push({ name: 'Sun Hat', category: 'clothing', essential: false, packed: false, quantity: 1 });
    }

    if (minTemp < 15) {
      items.push({ name: 'Light Jacket or Sweater', category: 'clothing', essential: true, packed: false, quantity: 1 });
    }
  }
}
