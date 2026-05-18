import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id');
  let query = supabase.from('riwayat_tes').select('*').order('created_at', { ascending: false }).limit(20);
  if (sessionId) query = query.eq('session_id', sessionId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabase
    .from('riwayat_tes')
    .insert({
      nama: body.nama,
      avg: body.avg,
      max: body.max,
      min: body.min,
      kondisi: body.kondisi,
      waktu: body.waktu,
      raw_data: body.rawData,
      session_id: body.sessionId,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id');
  let query = supabase.from('riwayat_tes').delete();
  query = sessionId ? query.eq('session_id', sessionId) : query.neq('id', '');
  const { error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
