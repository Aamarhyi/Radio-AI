import { BudgetTier, BudgetBreakdown } from '../types';

export class BudgetOptimizer {
  /**
   * Allocates a total budget across standard travel categories.
   * Based on industry standards and user preferences.
   */
  optimizeBudget(totalBudget: number, tier: BudgetTier, interests: any[]): BudgetBreakdown[] {
    const baseAllocations: Record<string, number> = {
      'Accommodation': 0.4,
      'Food & Dining': 0.2,
      'Activities': 0.2,
      'Transportation': 0.15,
      'Miscellaneous': 0.05
    };

    // Deep copy base allocations
    const allocations = { ...baseAllocations };

    // Adjust based on interests
    const foodInterest = interests.find(i => i.name === 'Food');
    if (foodInterest && foodInterest.rank >= 4) {
      allocations['Food & Dining'] += 0.1;
      allocations['Accommodation'] -= 0.1;
    }

    const shoppingInterest = interests.find(i => i.name === 'Shopping');
    if (shoppingInterest && shoppingInterest.rank >= 4) {
      allocations['Miscellaneous'] += 0.1;
      allocations['Accommodation'] -= 0.1;
    }

    return Object.entries(allocations).map(([category, percentage]) => ({
      category,
      allocated: Math.round(totalBudget * percentage),
      spent: 0,
      remaining: Math.round(totalBudget * percentage)
    }));
  }

  /**
   * Identifies overspend risks based on current itinerary costs.
   */
  getOverspendRisks(itinerary: any): string[] {
    const risks: string[] = [];
    const dailyAverage = itinerary.totalBudget / itinerary.dailyPlans.length;
    
    itinerary.dailyPlans.forEach((day: any) => {
      if (day.totalEstimatedCost > dailyAverage * 1.5) {
        risks.push(`Day ${day.dayNumber} is significantly over your average daily budget.`);
      }
    });

    return risks;
  }

  /**
   * Suggests savings opportunities.
   */
  getSavingsTips(destination: string): string[] {
    return [
      `Use the local city pass for ${destination} to save on top attractions.`,
      "Consider booking a hotel with breakfast included.",
      "Use public transportation instead of private taxis.",
      "Look for 'free walking tours' which are popular and budget-friendly.",
      "Visit popular sites during off-peak hours for potential discounts."
    ];
  }
}
