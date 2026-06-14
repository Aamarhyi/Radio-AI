import { NextResponse } from 'next/server';
import { createClient, getSessionUser } from '../../../lib/supabase';

/**
 * GET /api/trips/[id]
 * Retrieves details for a specific trip, including preferences, if the user is authorized.
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

    const tripId = params.id;
    const supabase = createClient();

    // Fetch the trip
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .single();

    if (tripError || !trip) {
      return NextResponse.json({ error: 'not_found', message: 'Trip not found.' }, { status: 404 });
    }

    // Verify authorized access (owner or collaborator)
    const { data: collaborator } = await supabase
      .from('collaborators')
      .select('*')
      .eq('trip_id', tripId)
      .eq('user_id', user.id)
      .maybeSingle();

    const isOwner = trip.user_id === user.id;
    const isCollaborator = !!collaborator;

    if (!isOwner && !isCollaborator) {
      return NextResponse.json({ error: 'forbidden', message: 'You do not have permission to view this trip.' }, { status: 403 });
    }

    // Fetch preferences
    const { data: preferences } = await supabase
      .from('trip_preferences')
      .select('*')
      .eq('trip_id', tripId)
      .maybeSingle();

    return NextResponse.json({
      trip,
      preferences,
      role: isOwner ? 'owner' : collaborator?.role || 'viewer',
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'server_error', message: err.message }, { status: 500 });
  }
}

/**
 * PUT /api/trips/[id]
 * Updates an existing trip's details. Only available to the owner or editor collaborators.
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'unauthorized', message: 'Authentication required' }, { status: 401 });
    }

    const tripId = params.id;
    const supabase = createClient();

    // Fetch the trip
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .single();

    if (tripError || !trip) {
      return NextResponse.json({ error: 'not_found', message: 'Trip not found.' }, { status: 404 });
    }

    // Verify update permission (owner or collaborator with role 'editor')
    const { data: collaborator } = await supabase
      .from('collaborators')
      .select('*')
      .eq('trip_id', tripId)
      .eq('user_id', user.id)
      .maybeSingle();

    const isOwner = trip.user_id === user.id;
    const isEditor = collaborator && collaborator.role === 'editor';

    if (!isOwner && !isEditor) {
      return NextResponse.json({ error: 'forbidden', message: 'You do not have permission to edit this trip.' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      destination,
      departure_city,
      start_date,
      end_date,
      budget_tier,
      budget_amount,
      travelers,
      status,
      // Preferences updates can also be passed here
      interests,
      transportation,
      accommodation,
      dietary_restrictions,
    } = body;

    // Build trip update payload
    const tripUpdates: Record<string, any> = {};
    if (title !== undefined) tripUpdates.title = title;
    if (destination !== undefined) tripUpdates.destination = destination;
    if (departure_city !== undefined) tripUpdates.departure_city = departure_city;
    if (start_date !== undefined) tripUpdates.start_date = start_date;
    if (end_date !== undefined) tripUpdates.end_date = end_date;
    if (budget_tier !== undefined) tripUpdates.budget_tier = budget_tier;
    if (budget_amount !== undefined) tripUpdates.budget_amount = Number(budget_amount);
    if (travelers !== undefined) tripUpdates.travelers = Number(travelers);
    if (status !== undefined) tripUpdates.status = status;

    // Update trip details
    const { data: updatedTrip, error: updateError } = await supabase
      .from('trips')
      .update(tripUpdates)
      .eq('id', tripId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: 'database_error', message: updateError.message }, { status: 500 });
    }

    // Handle preferences updates if any are provided
    if (
      interests !== undefined ||
      transportation !== undefined ||
      accommodation !== undefined ||
      dietary_restrictions !== undefined
    ) {
      const prefUpdates: Record<string, any> = {};
      if (interests !== undefined) prefUpdates.interests_json = interests;
      if (transportation !== undefined) prefUpdates.transportation = transportation;
      if (accommodation !== undefined) prefUpdates.accommodation = accommodation;
      if (dietary_restrictions !== undefined) prefUpdates.dietary_restrictions = dietary_restrictions;

      await supabase
        .from('trip_preferences')
        .update(prefUpdates)
        .eq('trip_id', tripId);
    }

    return NextResponse.json({
      message: 'Trip updated successfully.',
      trip: updatedTrip,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'server_error', message: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/trips/[id]
 * Deletes a trip. Only available to the trip owner.
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'unauthorized', message: 'Authentication required' }, { status: 401 });
    }

    const tripId = params.id;
    const supabase = createClient();

    // Fetch the trip
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .single();

    if (tripError || !trip) {
      return NextResponse.json({ error: 'not_found', message: 'Trip not found.' }, { status: 404 });
    }

    // Only owner can delete
    if (trip.user_id !== user.id) {
      return NextResponse.json({ error: 'forbidden', message: 'Only the trip owner can delete this trip.' }, { status: 403 });
    }

    // Delete the trip (related rows will be cascade deleted)
    const { error: deleteError } = await supabase
      .from('trips')
      .delete()
      .eq('id', tripId);

    if (deleteError) {
      return NextResponse.json({ error: 'database_error', message: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Trip deleted successfully.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'server_error', message: err.message }, { status: 500 });
  }
}
