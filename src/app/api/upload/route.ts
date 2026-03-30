import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return Response.json({ error: '파일이 없습니다.' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const buffer = await file.arrayBuffer()

  const { error } = await supabase.storage
    .from('copies')
    .upload(fileName, buffer, { contentType: file.type })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  const { data } = supabase.storage.from('copies').getPublicUrl(fileName)
  return Response.json({ url: data.publicUrl })
}
