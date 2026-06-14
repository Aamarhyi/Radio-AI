import { NextResponse } from 'next/server';
import { createClient, getSessionUser } from '../../../../../lib/supabase';
import { PackingGenerator } from '../../../../../lib/packing-generator';
import { WeatherService } from '../../../../../lib/weather-service';

/**
 * GET /api/trips/[id]/packing
 * Retrieves packing items for a trip. If the packing list is empty, 
 * automatically populates recommended defaults.
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

    // Query packing items
    let { data: packingItems, error: itemsError } = await supabase
      .from('packing_items')
      .select('*')
      .eq('trip_id', tripId)
      .order('category', { ascending: true });

    if (itemsError) {
      return NextResponse.json({ error: 'database_error', message: itemsError.message }, { status: 500 });
    }

    // Auto-populate recommended items if completely empty
    if (!packingItems || packingItems.length === 0) {
      // Fetch trip details to construct smart suggestions
      const { data: trip } = await supabase.from('trips').select('*').eq('id', tripId).single();
      if (trip) {
        const { data: preferences } = await supabase.from('trip_preferences').select('*').eq('trip_id', tripId).single();
        const weather = await WeatherService.getWeatherForDestination(
          trip.destination,
          trip.start_date || undefined,
          trip.end_date || undefined
        );

        const recommendations = await PackingGenerator.generatePackingList(
          trip.destination,
          weather,
          preferences?.interests_json || [],
          trip.travelers,
          tripId
        );

        const itemsToSave = recommendations.map(rec => ({
          trip_id: tripId,
          category: rec.category,
          item_name: rec.item_name,
          is_checked: false,
        }));

        const { data: insertedItems, error: insertError } = await supabase
          .from('packing_items')
          .insert(itemsToSave)
          .select();

        if (!insertError && insertedItems) {
          packingItems = insertedItems;
        }
      }
    }

    return NextResponse.json({ packing_items: packingItems || [] });
  } catch (err: any) {
    return NextResponse.json({ error: 'server_error', message: err.message }, { status: 500 });
  }
}

/**
 * POST /api/trips/[id]/packing
 * Adds a custom packing item.
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'unauthorized', message: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { item_name, category = 'other' } = body;

    if (!item_name) {
      return NextResponse.json({ error: 'bad_request', message: 'Item name is required.' }, { status: 400 });
    }

    const supabase = createClient();

    const { data: newItem, error } = await supabase
      .from('packing_items')
      .insert({
        trip_id: params.id,
        category,
        item_name,
        is_checked: false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'database_error', message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Packing item created successfully.', packing_item: newItem }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'server_error', message: err.message }, { status: 500 });
  }
}

/**
 * PUT /api/trips/[id]/packing
 * Updates a packing item (item_name, category, or checking/unchecking is_checked).
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

    const body = await request.json();
    const { id, item_name, category, is_checked } = body;

    if (!id) {
      return NextResponse.json({ error: 'bad_request', message: 'Packing item ID is required.' }, { status: 400 });
    }

    const supabase = createClient();

    // Verify it belongs to this trip
    const { data: existingItem } = await supabase
      .from('packing_items')
      .select('*')
      .eq('id', id)
      .eq('trip_id', params.id)
      .single();

    if (!existingItem) {
      return NextResponse.json({ error: 'not_found', message: 'Packing item not found on this trip.' }, { status: 404 });
    }

    const updates: Record<string, any> = {};
    if (item_name !== undefined) updates.item_name = item_name;
    if (category !== undefined) updates.category = category;
    if (is_checked !== undefined) updates.is_checked = !!is_checked;

    const { data: updatedItem, error } = await supabase
      .from('packing_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'database_error', message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Packing item updated successfully.', packing_item: updatedItem });
  } catch (err: any) {
    return NextResponse.json({ error: 'server_error', message: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/trips/[id]/packing
 * Deletes a packing item.
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

    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');

    if (!id) {
      try {
        const body = await request.json();
        id = body.id;
      } catch {}
    }

    if (!id) {
      return NextResponse.json({ error: 'bad_request', message: 'Packing item ID is required.' }, { status: 400 });
    }

    const supabase = createClient();

    const { error } = await supabase
      .from('packing_items')
      .delete()
      .eq('id', id)
      .eq('trip_id', params.id);

    if (error) {
      return NextResponse.json({ error: 'database_error', message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Packing item deleted successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: 'server_error', message: err.message }, { status: 500 });
  }
}
