import { NextResponse } from 'next/server';
import { createClient, getSessionUser } from '../../../lib/supabase';

import { chatWithAssistant } from '../../../../lib/ai-integration';

/**
 * POST /api/chat
 * AI assistant chat endpoint. Provides full-context answers by automatically
 * reading the corresponding trip, preferences, and daily plan details.
 */
export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'unauthorized', message: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { messages, tripId } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'bad_request', message: 'A "messages" array is required.' }, { status: 400 });
    }

    const supabase = createClient();
    let tripContextObj: any = null;

    // If tripId is provided, pull all trip context to feed into the AI system prompt
    if (tripId) {
      const { data: trip } = await supabase.from('trips').select('*').eq('id', tripId).single();
      if (trip) {
        const { data: preferences } = await supabase.from('trip_preferences').select('*').eq('trip_id', tripId).single();
        const { data: dailyPlans } = await supabase
          .from('daily_plans')
          .select(`
            day_number,
            date,
            activities(title, time_slot, location)
          `)
          .eq('trip_id', tripId)
          .order('day_number', { ascending: true });

        tripContextObj = {
          trip,
          preferences,
          dailyPlans
        };
      }
    }

    // Delegate to the AI integration bridge
    const response = await chatWithAssistant(
      messages[messages.length - 1]?.content || "",
      messages,
      tripContextObj
    );

    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json({ error: 'server_error', message: err.message }, { status: 500 });
  }
}
