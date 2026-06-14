import { NextResponse } from 'next/server';
import { createClient, getSessionUser } from '../../../../lib/supabase';

import { exportToICal, exportToPDF } from '../../../../lib/ai-integration';

/**
 * GET /api/export/[id]
 * Exports a trip itinerary as a standards-compliant iCalendar (.ics) file
 * or a beautifully formatted text layout (acting as PDF pre-export layout).
 * 
 * Query parameters:
 *  - format: 'calendar' | 'text' | 'pdf' (default 'calendar')
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'unauthorized', message: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'calendar';
    const tripId = params.id;
    const supabase = createClient();

    // 1. Fetch complete trip details
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .single();

    if (tripError || !trip) {
      return NextResponse.json({ error: 'not_found', message: 'Trip not found.' }, { status: 404 });
    }

    // Fetch daily plans & activities
    const { data: dailyPlans } = await supabase
      .from('daily_plans')
      .select(`
        *,
        activities(*)
      `)
      .eq('trip_id', tripId)
      .order('day_number', { ascending: true });

    // Fetch Stays & Restaurants for reference
    const { data: accommodations } = await supabase.from('accommodations').select('*').eq('trip_id', tripId);
    const { data: restaurants } = await supabase.from('restaurants').select('*').eq('trip_id', tripId);

    const fullItinerary = {
      ...trip,
      dailyPlans: dailyPlans?.map(dp => ({
        dayNumber: dp.day_number,
        date: dp.date,
        summary: dp.weather_json?.condition || '',
        activities: dp.activities.map((a: any) => ({
          timeSlot: a.time_slot,
          title: a.title,
          description: a.description,
          location: { name: a.location },
          cost: a.cost,
          category: a.category
        }))
      })) || []
    };

    // 2. Format as iCalendar (ICS)
    if (format === 'calendar') {
      const icsString = exportToICal(fullItinerary);

      return new Response(icsString, {
        headers: {
          'Content-Type': 'text/calendar; charset=utf-8',
          'Content-Disposition': `attachment; filename="trip-${trip.destination.toLowerCase().replace(/\s+/g, '-')}.ics"`,
        },
      });
    }

    // 3. Format as PDF
    if (format === 'pdf') {
      const pdfUrl = await exportToPDF(fullItinerary);
      return NextResponse.json({ url: pdfUrl });
    }

    // 4. Format as structured markdown text (perfect for printing or PDF rendering)
    if (format === 'text') {
      let layout = `# TRIP ITINERARY: ${trip.title.toUpperCase()}\n`;
      layout += `Destination: ${trip.destination}\n`;
      layout += `Dates: ${trip.start_date || 'TBD'} to ${trip.end_date || 'TBD'}\n`;
      layout += `Travelers: ${trip.travelers} | Budget: $${trip.budget_amount || 'Flexible'}\n\n`;

      if (accommodations && accommodations.length > 0) {
        layout += `## ACCOMMODATIONS & STAYS\n`;
        accommodations.forEach(acc => {
          layout += `- **${acc.name}** (${acc.type || 'Hotel'}) - Rating: ${acc.rating || 'N/A'}/5\n`;
        });
        layout += `\n`;
      }

      layout += `## DAY-BY-DAY ITINERARY\n\n`;

      if (dailyPlans && dailyPlans.length > 0) {
        dailyPlans.forEach(plan => {
          layout += `### Day ${plan.day_number} (${plan.date || 'TBD'})\n`;
          if (plan.weather_json) {
            const w = plan.weather_json;
            layout += `*Weather: ${w.condition || 'Clear'} (High: ${w.temp_high || 'N/A'}°C / Low: ${w.temp_low || 'N/A'}°C)*\n\n`;
          }

          const activities = plan.activities || [];
          if (activities.length === 0) {
            layout += `_No activities scheduled for today._\n\n`;
          } else {
            activities.forEach((act: any) => {
              layout += `#### 🕒 ${act.time_slot || 'Flexible'} - ${act.title}\n`;
              if (act.location) layout += `📍 *Location: ${act.location}*\n`;
              if (act.cost !== null && act.cost !== undefined) layout += `💵 *Cost: ${act.cost === 0 ? 'Free' : `$${act.cost}`}*\n`;
              if (act.description) layout += `${act.description}\n`;
              layout += `\n`;
            });
          }
        });
      } else {
        layout += `_Itinerary is empty. Generate your itinerary first!_\n`;
      }

      if (restaurants && restaurants.length > 0) {
        layout += `## SUGGESTED DINING\n`;
        restaurants.forEach(rest => {
          layout += `- **${rest.name}** (${rest.cuisine || 'Cuisine'}) - Price: ${rest.price_range || 'N/A'} | Rating: ${rest.rating || 'N/A'}/5\n`;
          if (rest.address) layout += `  Address: ${rest.address}\n`;
        });
      }

      return new Response(layout, {
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Content-Disposition': `attachment; filename="itinerary-${trip.destination.toLowerCase().replace(/\s+/g, '-')}.md"`,
        },
      });
    }

    return NextResponse.json({ error: 'bad_request', message: `Unsupported export format "${format}".` }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: 'server_error', message: err.message }, { status: 500 });
  }
}
