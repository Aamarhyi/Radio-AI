import { NextResponse } from 'next/server';
import { createClient, getSessionUser } from '../../../lib/supabase';
import { ItineraryGenerator } from '../../../lib/itinerary-generator';

/**
 * GET /api/trips
 * Retrieves all trips owned by the authenticated user, or where they are a collaborator.
 */
export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'unauthorized', message: 'Authentication required' }, { status: 401 });
    }

    const supabase = createClient();

    // Query trips owned by user OR where user is a collaborator
    const { data: trips, error } = await supabase
      .from('trips')
      .select(`
        *,
        collaborators!left(user_id)
      `)
      .or(`user_id.eq.${user.id},collaborators.user_id.eq.${user.id}`)
      .order('start_date', { ascending: true });

    if (error) {
      return NextResponse.json({ error: 'database_error', message: error.message }, { status: 500 });
    }

    return NextResponse.json({ trips });
  } catch (err: any) {
    return NextResponse.json({ error: 'server_error', message: err.message }, { status: 500 });
  }
}

/**
 * POST /api/trips
 * Creates a new trip and auto-generates premium defaults (preferences, default budget allocation, default packing list).
 */
export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'unauthorized', message: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      destination,
      departure_city = '',
      start_date = null,
      end_date = null,
      budget_tier = 'mid',
      budget_amount = 1500,
      travelers = 1,
      interests = [],
      transportation = 'public transit',
      accommodation = 'hotel',
      dietary_restrictions = [],
    } = body;

    if (!title || !destination) {
      return NextResponse.json({ error: 'bad_request', message: 'Title and Destination are required.' }, { status: 400 });
    }

    const supabase = createClient();

    // 1. Insert the main Trip record
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .insert({
        user_id: user.id,
        title,
        destination,
        departure_city,
        start_date,
        end_date,
        budget_tier,
        budget_amount,
        travelers,
        status: 'planning',
      })
      .select()
      .single();

    if (tripError || !trip) {
      return NextResponse.json({ error: 'database_error', message: tripError?.message || 'Failed to create trip' }, { status: 500 });
    }

    // 2. Insert associated Trip Preferences
    const { error: prefError } = await supabase
      .from('trip_preferences')
      .insert({
        trip_id: trip.id,
        interests_json: interests,
        transportation,
        accommodation,
        dietary_restrictions,
      });

    if (prefError) {
      console.error('Failed to create trip preferences:', prefError);
    }

    // 3. Generate high-quality mock/pre-populated defaults in the background (using our ItineraryGenerator)
    // This populates daily plans, activities, packing items, and budget items so the user gets an instant experience.
    const durationDays = start_date && end_date 
      ? Math.max(1, Math.ceil((new Date(end_date).getTime() - new Date(start_date).getTime()) / (24 * 60 * 60 * 1000)) + 1)
      : 5;

    const fullMock = await ItineraryGenerator.generateMockItinerary({
      destination,
      startDate: start_date || undefined,
      endDate: end_date || undefined,
      travelers,
      budgetTier: budget_tier,
      budgetAmount: budget_amount,
      interests,
      transportation,
      accommodationType: accommodation,
      dietaryRestrictions: dietary_restrictions,
    });

    // Save default budget items
    if (fullMock.budget_items.length > 0) {
      const budgetToSave = fullMock.budget_items.map(item => ({
        trip_id: trip.id,
        category: item.category,
        amount: item.amount,
        description: item.description,
        date: item.date,
      }));
      await supabase.from('budget_items').insert(budgetToSave);
    }

    // Save default packing items
    if (fullMock.packing_items.length > 0) {
      const packingToSave = fullMock.packing_items.map(item => ({
        trip_id: trip.id,
        category: item.category,
        item_name: item.item_name,
        is_checked: false,
      }));
      await supabase.from('packing_items').insert(packingToSave);
    }

    return NextResponse.json({
      message: 'Trip created successfully with premium defaults.',
      trip,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'server_error', message: err.message }, { status: 500 });
  }
}
