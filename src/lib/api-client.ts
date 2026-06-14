/**
 * Mock API Client for Raido AI
 * In a real app, this would use fetch/axios to call the backend.
 */

export const apiClient = {
  get: async <T>(url: string): Promise<T> => {
    console.log(`GET ${url}`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock responses based on URL
    if (url.includes('/api/trips/')) {
      const id = url.split('/').pop();
      return {
        id,
        title: "Summer in Santorini",
        destination: "Greece",
        startDate: "2026-07-15",
        endDate: "2026-07-22",
        budget: 5000,
        spent: 3100,
        currency: "USD",
        status: "Upcoming",
        image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=80",
        collaborators: [
          { id: "1", name: "Alex Rivera", role: "Owner", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80" },
          { id: "2", name: "Sarah Miller", role: "Editor", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" }
        ],
        itinerary: [
          {
            day: 1,
            date: "2026-07-15",
            activities: [
              { id: "a1", time: "09:00", title: "Arrival at Santorini Airport", location: "JTR Airport", type: "Transport", cost: 0 },
              { id: "a2", time: "11:30", title: "Hotel Check-in", location: "Oia, Santorini", type: "Stay", cost: 1200 },
              { id: "a3", time: "13:30", title: "Lunch at Melitini", location: "Oia", type: "Food", cost: 65 }
            ]
          }
        ]
      } as unknown as T;
    }
    
    return {} as T;
  },
  
  post: async <T>(url: string, data: any): Promise<T> => {
    console.log(`POST ${url}`, data);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, ...data } as T;
  }
};
