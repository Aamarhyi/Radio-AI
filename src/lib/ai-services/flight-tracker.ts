export interface FlightPrice {
  origin: string;
  destination: string;
  date: string;
  price: number;
  currency: string;
  carrier: string;
}

export class FlightTracker {
  /**
   * Fetches current flight prices for a route.
   * Currently uses mock data for MVP.
   */
  async getFlightPrices(origin: string, destination: string, date: string): Promise<FlightPrice[]> {
    console.log(`Tracking flight prices from ${origin} to ${destination} on ${date}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Mock prices based on route and date
    return [
      { origin, destination, date, price: 450 + Math.floor(Math.random() * 100), currency: 'USD', carrier: 'Global Air' },
      { origin, destination, date, price: 380 + Math.floor(Math.random() * 50), currency: 'USD', carrier: 'Budget Fly' },
      { origin, destination, date, price: 520 + Math.floor(Math.random() * 200), currency: 'USD', carrier: 'Luxury Wings' }
    ];
  }

  /**
   * Checks for price drops and returns alerts.
   */
  async getPriceAlerts(tripId: string): Promise<string[]> {
    const random = Math.random();
    if (random > 0.7) {
      return [`Price drop alert! Flights to your destination have dropped by 15% in the last 24 hours.`];
    }
    return [];
  }

  /**
   * Suggests the best time to book based on historical trends (mock).
   */
  getBookingAdvice(destination: string, travelMonth: number): string {
    return `Historical data suggests booking flights to ${destination} approximately 8 weeks in advance for the best rates.`;
  }
}
