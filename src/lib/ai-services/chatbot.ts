import { ChatMessage } from '../types';

export class ChatbotService {
  /**
   * Processes a user message and returns an assistant response.
   * Currently uses a rule-based mock for MVP.
   */
  async getResponse(message: string, history: ChatMessage[], tripContext?: any): Promise<ChatMessage> {
    console.log(`Processing chatbot message: ${message}`);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock logic for travel advice
    let responseContent = "";
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes("packing") || lowerMsg.includes("bring")) {
      responseContent = "For your trip, I recommend packing versatile layers, comfortable walking shoes, and a portable power bank. Don't forget your travel documents!";
    } else if (lowerMsg.includes("budget") || lowerMsg.includes("cost")) {
      responseContent = "I can help you optimize your budget! Generally, it's good to allocate about 40% for accommodation, 30% for food and activities, and 30% for transportation and miscellaneous.";
    } else if (lowerMsg.includes("weather")) {
      responseContent = "The weather for your destination looks mostly sunny with a few occasional showers. I've updated your itinerary with some indoor alternatives just in case.";
    } else if (lowerMsg.includes("thank")) {
      responseContent = "You're very welcome! I'm here to make your travel planning effortless. Is there anything else you'd like to adjust in your itinerary?";
    } else if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) {
      responseContent = "Hello! I'm your Raido AI travel assistant. How can I help you plan your perfect trip today?";
    } else {
      const destination = tripContext?.destination || "your destination";
      responseContent = `That's a great question about ${destination}. I recommend checking out the local hidden gems which I can add to your plan. Would you like to see some suggestions for ${destination}?`;
    }

    return {
      role: 'assistant',
      content: responseContent,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Provides structured updates to an itinerary based on chat.
   */
  async getItineraryUpdate(message: string, currentItinerary: any): Promise<any> {
    // This would return a partial itinerary or specific actions (add/remove activity)
    // For MVP, returning a mock update
    return null; 
  }
}
