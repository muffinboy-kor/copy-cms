import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') // "all" | "image" | "text"

  const where = type && type !== 'all'
    ? { type }
    : {}

  const copies = await prisma.copy.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })

  return Response.json(copies)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { text, company, imageUrl, type } = body

  if (!text || !company) {
    return Response.json({ error: '카피 문구와 기업명은 필수입니다.' }, { status: 400 })
  }

  const copy = await prisma.copy.create({
    data: { text, company, imageUrl: imageUrl ?? null, type },
  })

  return Response.json(copy, { status: 201 })
}
