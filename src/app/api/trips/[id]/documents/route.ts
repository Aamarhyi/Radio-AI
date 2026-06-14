import { NextResponse } from 'next/server';
import { createClient, getSessionUser } from '../../../../../lib/supabase';

/**
 * GET /api/trips/[id]/documents
 * Retrieves all documents uploaded for a specific trip.
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

    const { data: documents, error } = await supabase
      .from('documents')
      .select('*')
      .eq('trip_id', tripId)
      .order('name', { ascending: true });

    if (error) {
      return NextResponse.json({ error: 'database_error', message: error.message }, { status: 500 });
    }

    return NextResponse.json({ documents });
  } catch (err: any) {
    return NextResponse.json({ error: 'server_error', message: err.message }, { status: 500 });
  }
}

/**
 * POST /api/trips/[id]/documents
 * Adds a new travel document (flight ticket, hotel voucher, insurance, passport copy, etc.).
 * Supports metadata and a link to the stored file in Supabase Storage.
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
    const { name, type, file_url, expiry_date = null, notes = '' } = body;

    if (!name || !type || !file_url) {
      return NextResponse.json({
        error: 'bad_request',
        message: 'Name, Type (e.g. flight, hotel, passport), and File URL are required.',
      }, { status: 400 });
    }

    const supabase = createClient();

    const { data: document, error } = await supabase
      .from('documents')
      .insert({
        trip_id: params.id,
        name,
        type,
        file_url,
        expiry_date,
        notes,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'database_error', message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Document added successfully.', document }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'server_error', message: err.message }, { status: 500 });
  }
}

/**
 * PUT /api/trips/[id]/documents
 * Updates an existing document's metadata.
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
    const { id, name, type, file_url, expiry_date, notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'bad_request', message: 'Document ID is required.' }, { status: 400 });
    }

    const supabase = createClient();

    // Verify ownership on this trip
    const { data: existingDoc } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .eq('trip_id', params.id)
      .single();

    if (!existingDoc) {
      return NextResponse.json({ error: 'not_found', message: 'Document not found on this trip.' }, { status: 404 });
    }

    const updates: Record<string, any> = {};
    if (name !== undefined) updates.name = name;
    if (type !== undefined) updates.type = type;
    if (file_url !== undefined) updates.file_url = file_url;
    if (expiry_date !== undefined) updates.expiry_date = expiry_date;
    if (notes !== undefined) updates.notes = notes;

    const { data: updatedDoc, error } = await supabase
      .from('documents')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'database_error', message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Document updated successfully.', document: updatedDoc });
  } catch (err: any) {
    return NextResponse.json({ error: 'server_error', message: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/trips/[id]/documents
 * Deletes a document.
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
      return NextResponse.json({ error: 'bad_request', message: 'Document ID is required.' }, { status: 400 });
    }

    const supabase = createClient();

    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id)
      .eq('trip_id', params.id);

    if (error) {
      return NextResponse.json({ error: 'database_error', message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Document deleted successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: 'server_error', message: err.message }, { status: 500 });
  }
}
