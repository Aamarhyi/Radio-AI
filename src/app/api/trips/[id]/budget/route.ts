import { NextResponse } from 'next/server';
import { createClient, getSessionUser } from '../../../../../lib/supabase';
import { BudgetOptimizer } from '../../../../../lib/budget-optimizer';

/**
 * GET /api/trips/[id]/budget
 * Fetches all budget items for a trip and computes an optimized budget status report.
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

    // Fetch trip details to get total budget cap
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .single();

    if (tripError || !trip) {
      return NextResponse.json({ error: 'not_found', message: 'Trip not found.' }, { status: 404 });
    }

    // Fetch budget items
    const { data: budgetItems, error: itemsError } = await supabase
      .from('budget_items')
      .select('*')
      .eq('trip_id', tripId)
      .order('date', { ascending: true });

    if (itemsError) {
      return NextResponse.json({ error: 'database_error', message: itemsError.message }, { status: 500 });
    }

    // Compute duration in days for daily spending limits
    const durationDays = trip.start_date && trip.end_date 
      ? Math.max(1, Math.ceil((new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) / (24 * 60 * 60 * 1000)) + 1)
      : 5;

    // Run Optimization Algorithm
    const summary = BudgetOptimizer.optimizeBudget(
      trip.budget_amount || 0,
      (trip.budget_tier as 'budget' | 'mid' | 'luxury') || 'mid',
      budgetItems || [],
      durationDays
    );

    return NextResponse.json({
      budget_limit: trip.budget_amount,
      budget_tier: trip.budget_tier,
      budget_items: budgetItems,
      analysis: summary,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'server_error', message: err.message }, { status: 500 });
  }
}

/**
 * POST /api/trips/[id]/budget
 * Adds a new expense or budget item.
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

    const tripId = params.id;
    const body = await request.json();
    const { category, amount, description = '', date = null } = body;

    if (!category || amount === undefined || amount === null) {
      return NextResponse.json({ error: 'bad_request', message: 'Category and Amount are required.' }, { status: 400 });
    }

    const supabase = createClient();

    const { data: budgetItem, error } = await supabase
      .from('budget_items')
      .insert({
        trip_id: tripId,
        category,
        amount: Number(amount),
        description,
        date,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'database_error', message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Budget item created successfully.', budget_item: budgetItem }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'server_error', message: err.message }, { status: 500 });
  }
}

/**
 * PUT /api/trips/[id]/budget
 * Updates an existing expense or budget item. Passed inside the body.
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
    const { id, category, amount, description, date } = body;

    if (!id) {
      return NextResponse.json({ error: 'bad_request', message: 'Budget item ID is required.' }, { status: 400 });
    }

    const supabase = createClient();

    // Verify it belongs to this trip
    const { data: existingItem } = await supabase
      .from('budget_items')
      .select('*')
      .eq('id', id)
      .eq('trip_id', params.id)
      .single();

    if (!existingItem) {
      return NextResponse.json({ error: 'not_found', message: 'Budget item not found on this trip.' }, { status: 404 });
    }

    const updates: Record<string, any> = {};
    if (category !== undefined) updates.category = category;
    if (amount !== undefined) updates.amount = Number(amount);
    if (description !== undefined) updates.description = description;
    if (date !== undefined) updates.date = date;

    const { data: updatedItem, error } = await supabase
      .from('budget_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'database_error', message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Budget item updated successfully.', budget_item: updatedItem });
  } catch (err: any) {
    return NextResponse.json({ error: 'server_error', message: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/trips/[id]/budget
 * Deletes an expense or budget item. ID can be passed via query parameter (?id=xxx) or body.
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
      return NextResponse.json({ error: 'bad_request', message: 'Budget item ID is required.' }, { status: 400 });
    }

    const supabase = createClient();

    const { error } = await supabase
      .from('budget_items')
      .delete()
      .eq('id', id)
      .eq('trip_id', params.id);

    if (error) {
      return NextResponse.json({ error: 'database_error', message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Budget item deleted successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: 'server_error', message: err.message }, { status: 500 });
  }
}
