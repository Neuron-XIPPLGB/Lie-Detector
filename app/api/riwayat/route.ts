import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('riwayat_tes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

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
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE() {
  const { error } = await supabase.from('riwayat_tes').delete().neq('id', '');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
