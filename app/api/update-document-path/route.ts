import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { documentId, filePath } = await request.json()

    if (!documentId || !filePath) {
      return NextResponse.json(
        { error: 'documentId and filePath are required' },
        { status: 400 }
      )
    }

    const supabaseClient = await createClient()
    const supabase = supabaseClient as any

    const { error } = await supabase
      .from('documents')
      .update({
        original_file_path: filePath,
        updated_at: new Date().toISOString(),
      })
      .eq('id', documentId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
