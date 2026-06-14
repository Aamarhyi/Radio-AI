import { NextResponse } from 'next/server';
import { createClient, getSessionUser, getSupabaseAdmin } from '../../../../../lib/supabase';

/**
 * GET /api/trips/[id]/collaborators
 * Retrieves all collaborators added to a specific trip, joining with their public user profiles.
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

    // Fetch collaborators and join with their profiles (users table)
    const { data: collaborators, error } = await supabase
      .from('collaborators')
      .select(`
        *,
        user:users (
          name,
          email,
          avatar_url
        )
      `)
      .eq('trip_id', tripId);

    if (error) {
      return NextResponse.json({ error: 'database_error', message: error.message }, { status: 500 });
    }

    return NextResponse.json({ collaborators });
  } catch (err: any) {
    return NextResponse.json({ error: 'server_error', message: err.message }, { status: 500 });
  }
}

/**
 * POST /api/trips/[id]/collaborators
 * Invites a new collaborator by email. Looks up the user profile and creates a pending collaboration row.
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
    const { email, role = 'viewer' } = body;

    if (!email) {
      return NextResponse.json({ error: 'bad_request', message: 'Collaborator email is required.' }, { status: 400 });
    }

    const supabase = createClient();

    // 1. Check if trip exists and user is the owner (only owner can add collaborators)
    const { data: trip } = await supabase
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .single();

    if (!trip) {
      return NextResponse.json({ error: 'not_found', message: 'Trip not found.' }, { status: 404 });
    }

    if (trip.user_id !== user.id) {
      return NextResponse.json({ error: 'forbidden', message: 'Only the trip owner can invite collaborators.' }, { status: 403 });
    }

    // 2. Lookup the invited user in public users profile table by email
    const { data: invitedUser, error: userError } = await supabase
      .from('users')
      .select('id, name')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle();

    if (!invitedUser) {
      return NextResponse.json({
        error: 'user_not_found',
        message: `No registered user found with email ${email}. Tell them to sign up for Raido AI first!`,
      }, { status: 404 });
    }

    if (invitedUser.id === user.id) {
      return NextResponse.json({ error: 'bad_request', message: 'You cannot add yourself as a collaborator.' }, { status: 400 });
    }

    // 3. Check if they are already added
    const { data: existingCollab } = await supabase
      .from('collaborators')
      .select('*')
      .eq('trip_id', tripId)
      .eq('user_id', invitedUser.id)
      .maybeSingle();

    if (existingCollab) {
      return NextResponse.json({ error: 'already_added', message: 'User is already invited or a collaborator.' }, { status: 400 });
    }

    // 4. Create the collaborator record with status 'pending'
    const { data: collaborator, error: insertError } = await supabase
      .from('collaborators')
      .insert({
        trip_id: tripId,
        user_id: invitedUser.id,
        role,
        status: 'pending',
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: 'database_error', message: insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: `Successfully invited ${invitedUser.name || email} as ${role}.`,
      collaborator,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'server_error', message: err.message }, { status: 500 });
  }
}

/**
 * PUT /api/trips/[id]/collaborators
 * Updates invitation status (e.g., 'accepted' or 'declined') or changes roles (editor/viewer).
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
    const { id, role, status } = body;

    if (!id) {
      return NextResponse.json({ error: 'bad_request', message: 'Collaborator record ID is required.' }, { status: 400 });
    }

    const supabase = createClient();

    // Fetch existing collaborator record
    const { data: existingCollab } = await supabase
      .from('collaborators')
      .select('*')
      .eq('id', id)
      .eq('trip_id', params.id)
      .single();

    if (!existingCollab) {
      return NextResponse.json({ error: 'not_found', message: 'Collaborator record not found.' }, { status: 404 });
    }

    const updates: Record<string, any> = {};

    // Only the invited collaborator can accept/decline status
    if (status !== undefined) {
      if (existingCollab.user_id !== user.id) {
        return NextResponse.json({ error: 'forbidden', message: 'Only the invited user can change their invitation status.' }, { status: 403 });
      }
      updates.status = status;
    }

    // Only the trip owner can change roles (editor <-> viewer)
    if (role !== undefined) {
      const { data: trip } = await supabase.from('trips').select('user_id').eq('id', params.id).single();
      if (!trip || trip.user_id !== user.id) {
        return NextResponse.json({ error: 'forbidden', message: 'Only the trip owner can manage collaborator roles.' }, { status: 403 });
      }
      updates.role = role;
    }

    const { data: updatedCollab, error } = await supabase
      .from('collaborators')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'database_error', message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Collaboration updated successfully.', collaborator: updatedCollab });
  } catch (err: any) {
    return NextResponse.json({ error: 'server_error', message: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/trips/[id]/collaborators
 * Removes a collaborator. Trip owner can remove anyone. Collaborators can remove themselves (leave).
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
      return NextResponse.json({ error: 'bad_request', message: 'Collaborator ID is required.' }, { status: 400 });
    }

    const supabase = createClient();

    // Fetch collaboration and trip
    const { data: existingCollab } = await supabase
      .from('collaborators')
      .select('*')
      .eq('id', id)
      .eq('trip_id', params.id)
      .single();

    if (!existingCollab) {
      return NextResponse.json({ error: 'not_found', message: 'Collaborator record not found.' }, { status: 404 });
    }

    const { data: trip } = await supabase.from('trips').select('user_id').eq('id', params.id).single();

    const isOwner = trip && trip.user_id === user.id;
    const isSelf = existingCollab.user_id === user.id;

    if (!isOwner && !isSelf) {
      return NextResponse.json({ error: 'forbidden', message: 'You do not have permission to remove this collaborator.' }, { status: 403 });
    }

    const { error } = await supabase
      .from('collaborators')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: 'database_error', message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Collaborator removed successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: 'server_error', message: err.message }, { status: 500 });
  }
}
