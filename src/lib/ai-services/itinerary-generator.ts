import { TripPreferences, Itinerary, DailyPlan, Activity } from '../types';

export class ItineraryGenerator {
  /**
   * Generates a personalized itinerary based on user preferences.
   * Currently uses a sophisticated mock generator for MVP.
   */
  async generateItinerary(prefs: TripPreferences): Promise<Itinerary> {
    console.log(`Generating itinerary for ${prefs.destination}...`);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const startDate = new Date(prefs.startDate);
    const endDate = new Date(prefs.endDate);
    const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const dailyPlans: DailyPlan[] = [];

    for (let i = 1; i <= durationDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i - 1);
      
      dailyPlans.push(this.generateDailyPlan(i, currentDate.toISOString().split('T')[0], prefs));
    }

    const totalBudget = dailyPlans.reduce((sum, day) => sum + day.totalEstimatedCost, 0);

    return {
      id: Math.random().toString(36).substring(7),
      tripTitle: `My Trip to ${prefs.destination}`,
      destination: prefs.destination,
      startDate: prefs.startDate,
      endDate: prefs.endDate,
      budgetTier: prefs.budgetTier,
      dailyPlans,
      totalBudget,
      travelerCount: prefs.travelerCount,
      interests: prefs.interests
    };
  }

  private generateDailyPlan(dayNumber: number, date: string, prefs: TripPreferences): DailyPlan {
    const activities: Activity[] = [
      this.generateActivity(dayNumber, 'Morning', '09:00 - 12:00', prefs),
      this.generateActivity(dayNumber, 'Afternoon', '13:00 - 17:00', prefs),
      this.generateActivity(dayNumber, 'Evening', '19:00 - 22:00', prefs)
    ];

    const totalEstimatedCost = activities.reduce((sum, activity) => sum + activity.cost, 0);

    return {
      dayNumber,
      date,
      activities,
      totalEstimatedCost,
      summary: `A wonderful day exploring ${prefs.destination} focusing on your interests.`
    };
  }

  private generateActivity(dayNumber: number, period: string, timeSlot: string, prefs: TripPreferences): Activity {
    const interest = prefs.interests[Math.floor(Math.random() * prefs.interests.length)]?.name || 'General';
    
    // Mock data generation logic based on destination and interest
    const activityData = this.getMockActivityData(prefs.destination, interest, period);

    return {
      id: Math.random().toString(36).substring(7),
      title: activityData.title,
      description: activityData.description,
      timeSlot,
      duration: period === 'Morning' ? '3 hours' : period === 'Afternoon' ? '4 hours' : '3 hours',
      cost: this.calculateMockCost(prefs.budgetTier, period),
      location: {
        lat: 48.8566 + (Math.random() - 0.5) * 0.1, // Generic Paris-area mock coords
        lng: 2.3522 + (Math.random() - 0.5) * 0.1,
        name: activityData.locationName
      },
      transportSuggestion: 'Public transport or Walking',
      category: interest
    };
  }

  private getMockActivityData(destination: string, interest: string, period: string) {
    // This would be replaced by actual AI prompt results
    const templates: Record<string, any> = {
      'Morning': {
        'Food': { title: 'Local Breakfast & Market Tour', description: `Explore the best breakfast spots and local markets in ${destination}.`, locationName: 'Central Market' },
        'Culture': { title: 'Historical Walking Tour', description: `Walk through the historic heart of ${destination} and learn about its heritage.`, locationName: 'Old Town Square' },
        'Nature': { title: 'Sunrise Hike/Park Walk', description: `Enjoy the morning fresh air in ${destination}'s most beautiful natural spots.`, locationName: 'City Park' },
        'General': { title: 'Iconic Sightseeing', description: `Visit the most famous landmarks of ${destination}.`, locationName: 'City Landmark' }
      },
      'Afternoon': {
        'Food': { title: 'Cooking Class', description: `Learn how to make traditional dishes from ${destination}.`, locationName: 'Culinary School' },
        'Culture': { title: 'Museum Visit', description: `Discover the art and history at ${destination}'s premier museum.`, locationName: 'National Museum' },
        'Nature': { title: 'Botanical Garden Exploration', description: `Relax among exotic plants and local flora.`, locationName: 'Botanical Gardens' },
        'General': { title: 'City Exploration', description: `Wander through the vibrant neighborhoods of ${destination}.`, locationName: 'Main Street' }
      },
      'Evening': {
        'Food': { title: 'Gourmet Dinner Experience', description: `Savor the local flavors at a highly-rated restaurant in ${destination}.`, locationName: 'Riverside Bistro' },
        'Culture': { title: 'Evening Performance', description: `Experience the local performing arts or live music.`, locationName: 'Grand Theater' },
        'Nature': { title: 'Starlit Walk', description: `A peaceful walk under the stars in a safe, scenic area.`, locationName: 'Harbor Front' },
        'General': { title: 'Nightlife & Relaxation', description: `Wind down your day with local drinks and good vibes.`, locationName: 'Downtown Lounge' }
      }
    };

    return templates[period][interest] || templates[period]['General'];
  }

  private calculateMockCost(tier: string, period: string): number {
    const base = period === 'Morning' ? 20 : period === 'Afternoon' ? 40 : 60;
    const multiplier = tier === 'economy' ? 0.5 : tier === 'mid-range' ? 1 : tier === 'luxury' ? 2.5 : 1;
    return Math.round(base * multiplier);
  }

  /**
   * Generates prompt template for actual LLM usage (future).
   */
  getPromptTemplate(prefs: TripPreferences): string {
    return `Generate a ${prefs.budgetTier} day-by-day itinerary for a trip to ${prefs.destination} from ${prefs.startDate} to ${prefs.endDate}.
    Number of travelers: ${prefs.travelerCount}.
    Interests ranked by priority: ${prefs.interests.map(i => `${i.name} (${i.rank}/5)`).join(', ')}.
    Preferred transportation: ${prefs.transportation || 'Any'}.
    Preferred accommodation: ${prefs.accommodation || 'Any'}.
    
    Please provide the response in structured JSON format with morning, afternoon, and evening activities for each day.
    Include estimated costs, duration, and brief descriptions for each activity.
    Ensure activities are geographically grouped to minimize travel time.`;
  }
}
