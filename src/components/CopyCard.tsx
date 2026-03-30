'use client'

import { useState } from 'react'
import { Trash2, Building2, CalendarDays } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { Copy } from '@/types'

interface Props {
  copy: Copy
  onDeleted: () => void
}

export default function CopyCard({ copy, onDeleted }: Props) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('삭제하시겠습니까?')) return
    setDeleting(true)
    await fetch(`/api/copies/${copy.id}`, { method: 'DELETE' })
    onDeleted()
  }

  const dateStr = format(new Date(copy.createdAt), 'yyyy.MM.dd', { locale: ko })

  if (copy.imageUrl) {
    // 이미지 있는 카드
    return (
      <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="relative">
          <img
            src={copy.imageUrl}
            alt={copy.text}
            className="w-full aspect-video object-cover bg-gray-50"
          />
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="absolute top-2.5 right-2.5 p-1.5 bg-white/80 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 size={14} />
          </button>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-800 leading-relaxed font-medium line-clamp-3">{copy.text}</p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <Building2 size={12} />
              {copy.company}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <CalendarDays size={12} />
              {dateStr}
            </span>
          </div>
        </div>
      </div>
    )
  }

  // 이미지 없는 카드
  return (
    <div className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative">
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="absolute top-3.5 right-3.5 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500 text-gray-300"
      >
        <Trash2 size={14} />
      </button>
      <p className="text-sm text-gray-800 leading-relaxed font-medium pr-6 line-clamp-4">{copy.text}</p>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <Building2 size={12} />
          {copy.company}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-400">
          <CalendarDays size={12} />
          {dateStr}
        </span>
      </div>
    </div>
  )
}
