import { generateItinerary } from './ai-integration';
import { CompleteItinerary, DailyPlan, Activity, Restaurant, Accommodation, BudgetItem, PackingItem } from '../types';
import { WeatherService, WeatherData } from './weather-service';
import { PackingGenerator } from './packing-generator';
import { BudgetOptimizer } from './budget-optimizer';

/**
 * Service to handle AI-based itinerary generation prompt building, 
 * safe response parsing, and standard mock fallback creation.
 */
export class ItineraryGenerator {
  /**
   * Constructs a highly-structured prompt instructing an LLM to generate
   * a personalized travel plan conforming strictly to our database schema.
   */
  public static buildGenerationPrompt(params: {
    destination: string;
    startDate?: string;
    endDate?: string;
    travelers?: number;
    budgetTier?: 'budget' | 'mid' | 'luxury';
    budgetAmount?: number;
    interests?: string[];
    transportation?: string;
    accommodationType?: string;
    dietaryRestrictions?: string[];
    weatherData?: Record<string, WeatherData>;
  }): string {
    const {
      destination,
      startDate = 'flexible dates',
      endDate = 'flexible dates',
      travelers = 1,
      budgetTier = 'mid',
      budgetAmount = 1500,
      interests = [],
      transportation = 'public transit',
      accommodationType = 'hotel',
      dietaryRestrictions = [],
      weatherData = {},
    } = params;

    const weatherSummary = Object.entries(weatherData)
      .map(([date, data]) => `${date}: ${data.condition} (${data.temp_high}°C / ${data.temp_low}°C)`)
      .join(', ');

    return `
You are a luxury travel agent and elite concierge planner. Create a highly personalized, optimized day-by-day travel itinerary for a trip to "${destination}".

TRIP PARAMETERS:
- Destination: ${destination}
- Dates: ${startDate} to ${endDate}
- Travelers: ${travelers}
- Budget Level: ${budgetTier} (Total Limit: $${budgetAmount})
- Preferred Interests: ${interests.join(', ')}
- Preferred Transportation: ${transportation}
- Accommodation Type Preference: ${accommodationType}
- Dietary Restrictions: ${dietaryRestrictions.join(', ')}
- Expected Weather Context: ${weatherSummary || 'Temperate'}

YOUR OUTPUT MUST BE A JSON OBJECT conforming exactly to the following typescript structure. Ensure all numeric amounts fit the budget constraints (e.g., total accommodation and activity cost stays near $${budgetAmount}).

Desired JSON structure:
{
  "trip_title": "A captivating, short title for the trip",
  "daily_plans": [
    {
      "day_number": 1,
      "date": "YYYY-MM-DD",
      "weather_summary": "Brief weather description",
      "activities": [
        {
          "time_slot": "09:00", // exact HH:MM format
          "title": "Title of Activity",
          "description": "Engaging description explaining why they should visit",
          "location": "Venue Name / Address",
          "lat": 0.0, // Floating point GPS coordinate
          "lng": 0.0,
          "cost": 25.0, // Estimated cost in USD, 0 if free
          "category": "sightseeing", // sightseeing | adventure | culture | food | relaxation
          "duration_minutes": 120
        }
      ]
    }
  ],
  "restaurants": [
    {
      "name": "Restaurant Name",
      "cuisine": "Cuisine type",
      "price_range": "$$", // $ | $$ | $$$ | $$$$
      "rating": 4.5,
      "lat": 0.0,
      "lng": 0.0,
      "address": "Restaurant address",
      "dietary_options": ["vegan", "gluten-free"]
    }
  ],
  "accommodations": [
    {
      "name": "Hotel / Stay Name",
      "type": "hotel", // hotel | airbnb | resort | hostel
      "price_per_night": 120.0,
      "rating": 4.6,
      "lat": 0.0,
      "lng": 0.0,
      "amenities_json": ["Wi-Fi", "Pool"],
      "booking_url": ""
    }
  ]
}

CONSTRAINTS:
1. Budget limit is $${budgetAmount}. Ensure the sum of accommodation cost (price_per_night * days) plus total activity and restaurant costs stays under the budget limit.
2. Respect the preferred interests (${interests.join(', ')}) when designing daily activities.
3. Keep travel sequences geographically logical (venues on the same day should have close lat/lng coordinates).
4. For restaurants, always include options that support the specified dietary restrictions (${dietaryRestrictions.join(', ')}).
5. Output ONLY the raw JSON. Do not include markdown code block characters like \`\`\`json.
    `;
  }

  /**
   * Safely parses and normalizes the AI LLM output.
   */
  public static parseGeneratedItinerary(rawOutput: string): Partial<CompleteItinerary> | null {
    try {
      // Clean up potential markdown formatting if returned
      let cleanText = rawOutput.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.substring(7);
      }
      if (cleanText.startsWith('```')) {
        cleanText = cleanText.substring(3);
      }
      if (cleanText.endsWith('```')) {
        cleanText = cleanText.substring(0, cleanText.length - 3);
      }
      cleanText = cleanText.trim();

      const parsed = JSON.parse(cleanText);
      return parsed;
    } catch (err) {
      console.error('Failed to parse AI-generated itinerary text:', err);
      return null;
    }
  }

  /**
   * Generates a realistic, highly-tailored mock itinerary immediately.
   * Guarantees that the app has a flawless fallback.
   */
  public static async generateMockItinerary(params: {
    destination: string;
    startDate?: string;
    endDate?: string;
    travelers?: number;
    budgetTier?: 'budget' | 'mid' | 'luxury';
    budgetAmount?: number;
    interests?: string[];
    transportation?: string;
    accommodationType?: string;
    dietaryRestrictions?: string[];
  }): Promise<CompleteItinerary> {
    try {
      // Use the AI bridge for generating the mock itinerary structure
      const aiResult = await generateItinerary(params);
      
      const {
        destination,
        startDate = new Date().toISOString().split('T')[0],
        endDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        travelers = 1,
        budgetTier = 'mid',
        budgetAmount = 1500,
        interests = ['sightseeing', 'foodie'],
        transportation = 'public transit',
        accommodationType = 'hotel',
        dietaryRestrictions = [],
      } = params;

      const weatherForecast = await WeatherService.getWeatherForDestination(destination, startDate, endDate);

      return {
        trip: {
          id: 'mock-trip-123',
          user_id: 'mock-user-id',
          title: aiResult.trip_title || `Epic Travel Journey to ${destination}`,
          destination,
          departure_city: 'San Francisco',
          start_date: startDate,
          end_date: endDate,
          budget_tier: budgetTier,
          budget_amount: budgetAmount,
          travelers,
          status: 'planning',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        preferences: {
          id: 'mock-pref-123',
          trip_id: 'mock-trip-123',
          interests_json: interests,
          transportation,
          accommodation: accommodationType,
          dietary_restrictions: dietaryRestrictions,
        },
        daily_plans: aiResult.daily_plans.map((dp: any) => ({
          ...dp,
          id: `mock-dp-${dp.day_number}`,
          trip_id: 'mock-trip-123',
          weather_json: weatherForecast[dp.date] || { condition: dp.weather_summary }
        })),
        restaurants: aiResult.restaurants.map((r: any, i: number) => ({ ...r, id: `mock-rest-${i}`, trip_id: 'mock-trip-123' })),
        accommodations: aiResult.accommodations.map((a: any, i: number) => ({ ...a, id: `mock-acc-${i}`, trip_id: 'mock-trip-123' })),
        budget_items: [],
        packing_items: [],
        collaborators: [],
      };
    } catch (error) {
      console.error('Error in generateMockItinerary using AI bridge:', error);
    }

    const {
      destination,
      startDate = new Date().toISOString().split('T')[0],
      endDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      travelers = 1,
      budgetTier = 'mid',
      budgetAmount = 1500,
      interests = ['sightseeing', 'foodie'],
      transportation = 'public transit',
      accommodationType = 'hotel',
      dietaryRestrictions = [],
    } = params;

    // 1. Fetch climate conditions
    const weatherForecast = await WeatherService.getWeatherForDestination(destination, startDate, endDate);
    const dates = Object.keys(weatherForecast);

    // 2. Mock base accommodation & restaurant coordinates based on destination guess
    const baseLat = destination.toLowerCase().includes('tokyo') ? 35.6762 : 48.8566; // Tokyo vs Paris/default
    const baseLng = destination.toLowerCase().includes('tokyo') ? 139.6503 : 2.3522;

    const accommodations: Accommodation[] = [
      {
        id: 'mock-acc-1',
        trip_id: '',
        name: `The Grand ${destination} Oasis`,
        type: accommodationType,
        price_per_night: budgetTier === 'budget' ? 65 : budgetTier === 'mid' ? 140 : 380,
        rating: 4.7,
        lat: baseLat + 0.002,
        lng: baseLng - 0.001,
        amenities_json: ['Free High-Speed Wi-Fi', 'Complimentary Breakfast', 'Luggage Storage'],
        booking_url: 'https://example.com/booking/grand-oasis',
      },
    ];

    const restaurants: Restaurant[] = [
      {
        id: 'mock-rest-1',
        trip_id: '',
        name: `La Flambée de ${destination}`,
        cuisine: 'Traditional & Fusion',
        price_range: budgetTier === 'budget' ? '$' : budgetTier === 'mid' ? '$$' : '$$$',
        rating: 4.5,
        lat: baseLat - 0.004,
        lng: baseLng + 0.003,
        address: `15 Avenue de l'Esplanade, ${destination}`,
        dietary_options: dietaryRestrictions.length > 0 ? dietaryRestrictions : ['Vegetarian Friendly'],
        reservation_url: 'https://example.com/reserve/la-flambee',
      },
      {
        id: 'mock-rest-2',
        trip_id: '',
        name: `Zesty Corner Diner`,
        cuisine: 'Local Street Eats',
        price_range: '$',
        rating: 4.2,
        lat: baseLat + 0.008,
        lng: baseLng - 0.005,
        address: `7 Market Lane, ${destination}`,
        dietary_options: ['Vegan Options Available'],
        reservation_url: null,
      },
    ];

    // 3. Assemble Daily Plans & Activities
    const daily_plans: Array<DailyPlan & { activities: Activity[] }> = [];
    
    dates.forEach((dateStr, index) => {
      const dayNum = index + 1;
      const weather = weatherForecast[dateStr];

      const activities: Activity[] = [
        {
          id: `mock-act-day-${dayNum}-1`,
          daily_plan_id: '',
          time_slot: '09:30',
          title: `Exploring ${destination} Landmark Center`,
          description: `A fantastic start to your journey. Walk around the historic square, take stunning photos, and absorb the local vibes. Recommended by travel experts.`,
          location: `Central Square, ${destination}`,
          lat: baseLat + 0.001,
          lng: baseLng + 0.002,
          cost: budgetTier === 'budget' ? 0 : 25,
          category: 'sightseeing',
          duration_minutes: 150,
          booking_url: null,
        },
        {
          id: `mock-act-day-${dayNum}-2`,
          daily_plan_id: '',
          time_slot: '14:00',
          title: interests.includes('adventure') ? 'Scenic Bike Trek & Panorama Hike' : 'Cultural Immersion & Museum Walk',
          description: `Dive deep into your chosen interest. Discover hidden viewpoints or examine breathtaking local art collections while escaping the afternoon sun.`,
          location: `Cultural District, ${destination}`,
          lat: baseLat - 0.002,
          lng: baseLng - 0.003,
          cost: budgetTier === 'budget' ? 5 : budgetTier === 'mid' ? 35 : 80,
          category: interests.includes('adventure') ? 'adventure' : 'culture',
          duration_minutes: 180,
          booking_url: 'https://example.com/tours/landmark',
        },
        {
          id: `mock-act-day-${dayNum}-3`,
          daily_plan_id: '',
          time_slot: '19:30',
          title: `Sunset Culinary Feast`,
          description: `Savor exquisite gourmet specialties prepared by master chefs, celebrating the unique flavors of ${destination}.`,
          location: `Waterfront Promenade, ${destination}`,
          lat: baseLat + 0.004,
          lng: baseLng + 0.005,
          cost: budgetTier === 'budget' ? 12 : budgetTier === 'mid' ? 40 : 120,
          category: 'food',
          duration_minutes: 120,
          booking_url: null,
        },
      ];

      daily_plans.push({
        id: `mock-dp-${dayNum}`,
        trip_id: '',
        day_number: dayNum,
        date: dateStr,
        weather_json: weather as any,
        activities,
      });
    });

    // 4. Budget optimization & items
    const defaultBudget = await BudgetOptimizer.generateDefaultBudget(budgetAmount, budgetTier, dates.length, interests);
    const budget_items: BudgetItem[] = defaultBudget.map((allocation, i) => ({
      id: `mock-budget-${i}`,
      trip_id: '',
      category: allocation.category,
      amount: allocation.allocatedAmount,
      description: `Target allocation for ${allocation.category}`,
      date: startDate,
    }));

    // 5. Packing list suggestions
    const packingSuggestions = await PackingGenerator.generatePackingList(destination, weatherForecast, interests, travelers);
    const packing_items: PackingItem[] = packingSuggestions.map((sug, i) => ({
      id: `mock-packing-${i}`,
      trip_id: '',
      category: sug.category,
      item_name: sug.item_name,
      is_checked: false,
    }));

    // Combine into a full mock trip package
    return {
      trip: {
        id: 'mock-trip-123',
        user_id: 'mock-user-id',
        title: `Epic Travel Journey to ${destination}`,
        destination,
        departure_city: 'San Francisco',
        start_date: startDate,
        end_date: endDate,
        budget_tier: budgetTier,
        budget_amount: budgetAmount,
        travelers,
        status: 'planning',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      preferences: {
        id: 'mock-pref-123',
        trip_id: 'mock-trip-123',
        interests_json: interests,
        transportation,
        accommodation: accommodationType,
        dietary_restrictions: dietaryRestrictions,
      },
      daily_plans,
      restaurants,
      accommodations,
      budget_items,
      packing_items,
      collaborators: [],
    };
  }
}
