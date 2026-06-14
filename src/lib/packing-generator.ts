import { generatePackingList as generateAIPackingList } from './ai-integration';
import { WeatherData } from './weather-service';

export interface PackingItemSuggestion {
  item_name: string;
  category: string;
}

/**
 * Service to generate dynamically tailored packing lists based on
 * destination climatology, trip preferences, and traveler count.
 * Delegates to AI integration bridge for smarter results.
 */
export class PackingGenerator {
  /**
   * Generates a list of suggested packing items.
   */
  public static async generatePackingList(
    destination: string,
    weatherForecast: Record<string, WeatherData>,
    interests: string[] = [],
    travelers: number = 1,
    tripId: string = 'new-trip'
  ): Promise<PackingItemSuggestion[]> {
    try {
      const forecastArray = Object.entries(weatherForecast).map(([date, data]) => ({
        date,
        ...data
      }));

      const aiResult = await generateAIPackingList(
        tripId,
        destination,
        forecastArray.length || 5,
        [], // activities placeholder
        forecastArray
      );

      if (aiResult && aiResult.items && aiResult.items.length > 0) {
        return aiResult.items.map((item: any) => ({
          item_name: item.name,
          category: item.category
        }));
      }
    } catch (error) {
      console.error('Error in AI packing generator, falling back to local logic:', error);
    }

    const items: PackingItemSuggestion[] = [];
    const destinationLower = destination.toLowerCase();

    // 1. Core Essentials (Always Required)
    const essentials = [
      { item_name: 'Passport / ID card', category: 'documents' },
      { item_name: 'Flight / Hotel confirmations (printed or digital)', category: 'documents' },
      { item_name: 'Credit cards & small cash', category: 'documents' },
      { item_name: 'Phone & phone charger', category: 'electronics' },
      { item_name: 'Universal travel adapter', category: 'electronics' },
      { item_name: 'Toothbrush & toothpaste', category: 'toiletries' },
      { item_name: 'Deodorant', category: 'toiletries' },
      { item_name: 'First-aid kit (painkillers, band-aids, personal meds)', category: 'toiletries' },
      { item_name: 'Travel pillow & eye mask', category: 'other' },
    ];
    items.push(...essentials);

    // 2. Weather-based Heuristics
    let isRainy = false;
    let isCold = false;
    let isWarmOrHot = false;
    let averageHighTemp = 20;

    const forecastDays = Object.values(weatherForecast);
    if (forecastDays.length > 0) {
      const sumHigh = forecastDays.reduce((acc, curr) => acc + curr.temp_high, 0);
      averageHighTemp = sumHigh / forecastDays.length;

      isRainy = forecastDays.some(
        (day) =>
          day.condition.toLowerCase().includes('rain') ||
          day.condition.toLowerCase().includes('drizzle') ||
          day.condition.toLowerCase().includes('shower') ||
          day.precipitation_chance > 40
      );

      isCold = forecastDays.some((day) => day.temp_low < 10);
      isWarmOrHot = forecastDays.some((day) => day.temp_high > 24);
    }

    // Rain items
    if (isRainy || destinationLower.includes('london')) {
      items.push(
        { item_name: 'Compact travel umbrella', category: 'clothing' },
        { item_name: 'Waterproof jacket or poncho', category: 'clothing' },
        { item_name: 'Water-resistant walking shoes', category: 'clothing' }
      );
    }

    // Cold weather items
    if (isCold || averageHighTemp < 12) {
      items.push(
        { item_name: 'Warm winter coat / parka', category: 'clothing' },
        { item_name: 'Thermal underwear (base layers)', category: 'clothing' },
        { item_name: 'Fleece or wool sweater', category: 'clothing' },
        { item_name: 'Beanie, scarf, and warm gloves', category: 'clothing' },
        { item_name: 'Lip balm & heavy moisturizer', category: 'toiletries' }
      );
    }

    // Warm weather items
    if (isWarmOrHot || averageHighTemp > 22) {
      items.push(
        { item_name: 'Lightweight t-shirts & tank tops', category: 'clothing' },
        { item_name: 'Shorts / skirts / light dresses', category: 'clothing' },
        { item_name: 'Sunglasses with UV protection', category: 'clothing' },
        { item_name: 'Sunscreen (SPF 30+)', category: 'toiletries' },
        { item_name: 'After-sun lotion / Aloe vera', category: 'toiletries' },
        { item_name: 'Reusable water bottle', category: 'other' }
      );
    }

    // Mid-season or transitional default clothing
    if (!isCold && !isWarmOrHot) {
      items.push(
        { item_name: 'Light jacket or windbreaker', category: 'clothing' },
        { item_name: 'Long pants / jeans', category: 'clothing' },
        { item_name: 'Comfortable sneakers for walking', category: 'clothing' },
        { item_name: 'Layering cardigans or light hoodies', category: 'clothing' }
      );
    }

    // 3. Interest/Preference-based Items
    const interestSet = new Set(interests.map((i) => i.toLowerCase()));

    if (interestSet.has('beach') || interestSet.has('swimming') || destinationLower.includes('bali') || destinationLower.includes('hawaii')) {
      items.push(
        { item_name: 'Swimwear (bikini, trunks, or swim shirt)', category: 'clothing' },
        { item_name: 'Quick-dry travel towel', category: 'clothing' },
        { item_name: 'Flip-flops or sandals', category: 'clothing' },
        { item_name: 'Waterproof phone pouch', category: 'electronics' },
        { item_name: 'Beach bag / tote', category: 'other' }
      );
    }

    if (interestSet.has('hiking') || interestSet.has('nature') || interestSet.has('adventure')) {
      items.push(
        { item_name: 'Hiking boots or trail shoes', category: 'clothing' },
        { item_name: 'Moisture-wicking athletic socks', category: 'clothing' },
        { item_name: 'Insect repellent (DEET or Picaridin)', category: 'toiletries' },
        { item_name: 'Daypack (15-25L)', category: 'other' },
        { item_name: 'Energy bars / high-protein snacks', category: 'other' }
      );
    }

    if (interestSet.has('culture') || interestSet.has('sightseeing') || interestSet.has('museums')) {
      items.push(
        { item_name: 'Comfortable walking shoes (essential for cobblestones)', category: 'clothing' },
        { item_name: 'Modest clothing (covering shoulders/knees for temples/churches)', category: 'clothing' },
        { item_name: 'Travel guidebook / offline maps downloaded', category: 'other' }
      );
    }

    if (interestSet.has('foodie') || interestSet.has('nightlife') || interestSet.has('fine_dining')) {
      items.push(
        { item_name: 'One upscale or smart-casual outfit', category: 'clothing' },
        { item_name: 'Dress shoes or stylish flats', category: 'clothing' },
        { item_name: 'Antacids & digestive enzymes', category: 'toiletries' }
      );
    }

    // 4. Group / Multi-traveler considerations
    if (travelers > 1) {
      items.push(
        { item_name: 'Multi-port USB charging hub', category: 'electronics' },
        { item_name: 'Deck of cards or compact travel game', category: 'other' }
      );
    }

    // Remove any exact duplicate names within categories
    const seen = new Set<string>();
    return items.filter((item) => {
      const key = `${item.category}:${item.item_name.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}
