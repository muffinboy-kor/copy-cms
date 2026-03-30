import { prisma } from '@/lib/prisma'

export async function DELETE(_req: Request, ctx: RouteContext<'/api/copies/[id]'>) {
  const { id } = await ctx.params

  await prisma.copy.delete({ where: { id } })

  return Response.json({ success: true })
}
