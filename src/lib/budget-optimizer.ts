import { optimizeBudget as optimizeAIBudget } from './ai-integration';

export interface BudgetAllocation {
  category: string;
  percentage: number;
  allocatedAmount: number;
  recommendedDailyLimit?: number;
}

export interface BudgetStatusReport {
  totalBudgetLimit: number;
  totalSpent: number;
  remainingBudget: number;
  isOverBudget: boolean;
  spendingPercentage: number;
  categoryReports: Record<
    string,
    {
      allocated: number;
      spent: number;
      remaining: number;
      isOverBudget: boolean;
    }
  >;
  recommendations: string[];
}

/**
 * Service to calculate travel budget allocations, optimize spending categories,
 * and provide actionable optimization tips based on actual expenses.
 * Delegates to AI integration bridge for smart allocations.
 */
export class BudgetOptimizer {
  // Classic standard travel allocation percentages by tier
  private static ALLOCATIONS: Record<string, Record<string, number>> = {
    budget: {
      flights: 25,
      accommodation: 30,
      meals: 20,
      activities: 10,
      other: 15,
    },
    mid: {
      flights: 20,
      accommodation: 35,
      meals: 20,
      activities: 15,
      other: 10,
    },
    luxury: {
      flights: 15,
      accommodation: 45,
      meals: 18,
      activities: 15,
      other: 7,
    },
  };

  /**
   * Generates a recommended default budget breakdown for a trip based on
   * budget tier, total amount, and duration.
   */
  public static async generateDefaultBudget(
    totalBudget: number,
    tier: 'budget' | 'mid' | 'luxury' = 'mid',
    durationDays: number = 5,
    interests: string[] = []
  ): Promise<BudgetAllocation[]> {
    try {
      const aiAllocations = await optimizeAIBudget(totalBudget, tier, interests);
      if (aiAllocations && aiAllocations.length > 0) {
        return aiAllocations.map((a: any) => ({
          category: a.category,
          percentage: (a.allocated / totalBudget) * 100,
          allocatedAmount: a.allocated,
          recommendedDailyLimit: a.category === 'Food & Dining' || a.category === 'Activities' 
            ? a.allocated / durationDays 
            : undefined
        }));
      }
    } catch (error) {
      console.error('Error in AI budget optimizer, falling back to local logic:', error);
    }

    const percentages = this.ALLOCATIONS[tier] || this.ALLOCATIONS.mid;
    const allocations: BudgetAllocation[] = [];

    for (const [category, pct] of Object.entries(percentages)) {
      const allocatedAmount = Math.round((totalBudget * (pct / 100)) * 100) / 100;
      
      const allocation: BudgetAllocation = {
        category,
        percentage: pct,
        allocatedAmount,
      };

      // Calculate daily limits for food or daily expenses
      if (category === 'meals' || category === 'activities' || category === 'other') {
        allocation.recommendedDailyLimit = Math.round((allocatedAmount / durationDays) * 100) / 100;
      }

      allocations.push(allocation);
    }

    return allocations;
  }

  /**
   * Analyzes current spent items against the budget cap and tier guidelines,
   * returning a full budget status report and AI-like recommendations.
   */
  public static optimizeBudget(
    totalBudgetLimit: number,
    tier: 'budget' | 'mid' | 'luxury' = 'mid',
    actualExpenses: Array<{ category: string; amount: number }>,
    durationDays: number = 5
  ): BudgetStatusReport {
    const percentages = this.ALLOCATIONS[tier] || this.ALLOCATIONS.mid;
    const totalSpent = actualExpenses.reduce((sum, item) => sum + item.amount, 0);
    const remainingBudget = totalBudgetLimit - totalSpent;
    const isOverBudget = totalSpent > totalBudgetLimit;
    const spendingPercentage = totalBudgetLimit > 0 ? (totalSpent / totalBudgetLimit) * 100 : 0;

    // Track spending by category
    const spentByCategory: Record<string, number> = {};
    for (const exp of actualExpenses) {
      const cat = exp.category.toLowerCase();
      spentByCategory[cat] = (spentByCategory[cat] || 0) + exp.amount;
    }

    const categoryReports: Record<string, any> = {};
    const recommendations: string[] = [];

    // Evaluate each category
    for (const [category, pct] of Object.entries(percentages)) {
      const allocated = Math.round((totalBudgetLimit * (pct / 100)) * 100) / 100;
      const spent = Math.round((spentByCategory[category] || 0) * 100) / 100;
      const remaining = allocated - spent;
      const isCatOverBudget = spent > allocated;

      categoryReports[category] = {
        allocated,
        spent,
        remaining,
        isOverBudget: isCatOverBudget,
      };

      // Heuristic tips/recommendations based on category spending
      if (isCatOverBudget) {
        if (category === 'accommodation') {
          recommendations.push(
            `You are over your ${category} budget by $${Math.abs(remaining).toFixed(2)}. Consider looking for homestays or budget boutique hotels to lower your lodging costs.`
          );
        } else if (category === 'meals') {
          recommendations.push(
            `Your food expenses exceed your $${allocated.toFixed(2)} allocation. Try exploring local street food markets or selecting accommodations with complimentary breakfast to optimize dining costs.`
          );
        } else if (category === 'flights') {
          recommendations.push(
            `Transportation cost is higher than planned. Look into regional rail passes, public transit, or rideshare-pooling instead of private cabs.`
          );
        } else {
          recommendations.push(
            `You have exceeded the recommended allocation for "${category}" by $${Math.abs(remaining).toFixed(2)}. Trim optional purchases to compensate.`
          );
        }
      } else {
        // Under-spent suggestions
        if (spent > 0 && spent < allocated * 0.4 && remainingBudget > 0) {
          if (category === 'activities') {
            recommendations.push(
              `You have some extra room in your "${category}" budget. Consider booking a premium local guided tour or unique experience!`
            );
          } else if (category === 'meals') {
            recommendations.push(
              `You've been highly economical on food! Treat yourself to a highly-rated dining experience at your destination.`
            );
          }
        }
      }
    }

    // General overall recommendations
    if (isOverBudget) {
      recommendations.unshift(
        `🔴 Alert: You are over your total trip budget by $${Math.abs(remainingBudget).toFixed(2)} (${spendingPercentage.toFixed(1)}% spent). We highly recommend pausing miscellaneous purchases.`
      );
    } else if (spendingPercentage > 85) {
      recommendations.unshift(
        `⚠️ Caution: You have utilized ${spendingPercentage.toFixed(1)}% of your total budget. Only $${remainingBudget.toFixed(2)} remains for the rest of your trip.`
      );
    } else if (spendingPercentage < 50 && durationDays > 0) {
      const dailyLeft = remainingBudget / durationDays;
      recommendations.unshift(
        `🟢 Great job! You are well within budget. You have about $${dailyLeft.toFixed(2)} available to spend per day for the rest of the trip.`
      );
    }

    return {
      totalBudgetLimit,
      totalSpent: Math.round(totalSpent * 100) / 100,
      remainingBudget: Math.round(remainingBudget * 100) / 100,
      isOverBudget,
      spendingPercentage: Math.round(spendingPercentage * 100) / 100,
      categoryReports,
      recommendations,
    };
  }
}
