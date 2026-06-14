import { 
  ItineraryGenerator, 
  ChatbotService, 
  WeatherService as AIWeatherService, 
  PackingListGenerator, 
  BudgetOptimizer as AIBudgetOptimizer, 
  ExportService, 
  FlightTracker 
} from '../../../ai-integration/src/lib/services';
import * as Types from '../types';

// Initialize services
const itineraryGen = new ItineraryGenerator();
const chatbot = new ChatbotService();
const weatherSvc = new AIWeatherService();
const packingGen = new PackingListGenerator();
const budgetOpt = new AIBudgetOptimizer();
const exportSvc = new ExportService();
const flightTracker = new FlightTracker();

/**
 * Bridge between AI services and Backend API routes.
 * This file provides clean, typed functions that wrap the core AI logic.
 */

export async function generateItinerary(prefs: any): Promise<any> {
  try {
    // Map backend preferences to AI service preferences
    const aiPrefs = {
      destination: prefs.destination,
      startDate: prefs.startDate || prefs.start_date || new Date().toISOString(),
      endDate: prefs.endDate || prefs.end_date || new Date().toISOString(),
      budgetTier: (prefs.budgetTier === 'budget' || prefs.budget_tier === 'budget' ? 'economy' : (prefs.budgetTier === 'luxury' || prefs.budget_tier === 'luxury') ? 'luxury' : 'mid-range') as any,
      travelerCount: prefs.travelers || 1,
      interests: (prefs.interests || []).map((i: string) => ({ name: i, rank: 5 })),
      transportation: prefs.transportation,
      accommodation: prefs.accommodation
    };

    const result = await itineraryGen.generateItinerary(aiPrefs);

    // Map AI result to backend's expected CompleteItinerary structure for the API route
    return {
      trip_title: result.tripTitle,
      daily_plans: result.dailyPlans.map(day => ({
        day_number: day.dayNumber,
        date: day.date,
        weather_summary: day.summary,
        activities: day.activities.map(act => ({
          time_slot: act.timeSlot,
          title: act.title,
          description: act.description,
          location: act.location.name || act.location.address,
          lat: act.location.lat,
          lng: act.location.lng,
          cost: act.cost,
          category: act.category.toLowerCase(),
          duration_minutes: parseInt(act.duration) * 60 || 120
        }))
      })),
      // Mock some restaurants and accommodations since my core service doesn't return them separately yet
      // but the backend API route expects them
      restaurants: [
        {
          name: "Local Delight",
          cuisine: "Traditional",
          price_range: "$",
          rating: 4.5,
          lat: result.dailyPlans[0]?.activities[0]?.location.lat || 0,
          lng: result.dailyPlans[0]?.activities[0]?.location.lng || 0,
          address: "123 Food Street",
          dietary_options: ["vegetarian"]
        }
      ],
      accommodations: [
        {
          name: "Grand Hotel",
          type: "hotel",
          price_per_night: 150,
          rating: 4.8,
          lat: result.dailyPlans[0]?.activities[0]?.location.lat || 0,
          lng: result.dailyPlans[0]?.activities[0]?.location.lng || 0,
          amenities_json: ["Wi-Fi", "Pool"],
          booking_url: "https://example.com"
        }
      ]
    };
  } catch (error) {
    console.error('Error in generateItinerary adapter:', error);
    throw error;
  }
}

export async function chatWithAssistant(message: string, history: Types.ChatMessage[], tripContext?: any): Promise<Types.ChatMessage> {
  try {
    const response = await chatbot.getResponse(message, history as any, tripContext);
    return {
      role: response.role,
      content: response.content,
      timestamp: response.timestamp
    };
  } catch (error) {
    console.error('Error in chatWithAssistant adapter:', error);
    return {
      role: 'assistant',
      content: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again in a moment.",
      timestamp: new Date().toISOString()
    };
  }
}

export async function getWeatherForecast(destination: string, startDate: string, endDate: string): Promise<any[]> {
  try {
    return await weatherSvc.getForecast(destination, startDate, endDate);
  } catch (error) {
    console.error('Error in getWeatherForecast adapter:', error);
    return [];
  }
}

export async function generatePackingList(tripId: string, destination: string, days: number, activities: any[], forecasts: any[]): Promise<any> {
  try {
    return packingGen.generatePackingList(tripId, destination, days, activities, forecasts);
  } catch (error) {
    console.error('Error in generatePackingList adapter:', error);
    return { tripId, items: [] };
  }
}

export async function optimizeBudget(totalBudget: number, tier: Types.BudgetTier, interests: string[]): Promise<any[]> {
  try {
    const aiTier = (tier === 'budget' ? 'economy' : tier === 'luxury' ? 'luxury' : 'mid-range') as any;
    const aiInterests = interests.map(i => ({ name: i, rank: 5 }));
    return budgetOpt.optimizeBudget(totalBudget, aiTier, aiInterests);
  } catch (error) {
    console.error('Error in optimizeBudget adapter:', error);
    return [];
  }
}

export async function exportToPDF(itinerary: any): Promise<string> {
  try {
    return await exportSvc.exportToPDF(itinerary);
  } catch (error) {
    console.error('Error in exportToPDF adapter:', error);
    throw error;
  }
}

export async function exportToICal(itinerary: any): Promise<string> {
  try {
    return exportSvc.exportToICal(itinerary);
  } catch (error) {
    console.error('Error in exportToICal adapter:', error);
    return "";
  }
}

export async function getFlightPrices(origin: string, destination: string, date: string): Promise<any[]> {
  try {
    return await flightTracker.getFlightPrices(origin, destination, date);
  } catch (error) {
    console.error('Error in getFlightPrices adapter:', error);
    return [];
  }
}

export async function getWeatherRecommendations(tripId: string, destination: string, durationDays: number, activities: any[], forecasts: any[]): Promise<string[]> {
  try {
    // Combine weather analysis and packing logic for specific weather-aware recommendations
    return weatherSvc.getPackingRecommendations(forecasts);
  } catch (error) {
    console.error('Error in getWeatherRecommendations adapter:', error);
    return [];
  }
}
