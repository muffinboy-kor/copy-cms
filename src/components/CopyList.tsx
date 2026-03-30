'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus } from 'lucide-react'
import type { Copy } from '@/types'
import CopyCard from './CopyCard'
import AddCopyModal from './AddCopyModal'

type Tab = 'all' | 'text' | 'image'

const TABS: { key: Tab; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'text', label: '문구' },
  { key: 'image', label: '이미지' },
]

export default function CopyList() {
  const [tab, setTab] = useState<Tab>('all')
  const [copies, setCopies] = useState<Copy[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const fetchCopies = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/copies?type=${tab}`)
    const data = await res.json()
    setCopies(data)
    setLoading(false)
  }, [tab])

  useEffect(() => {
    fetchCopies()
  }, [fetchCopies])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Copy CMS</h1>
            <p className="text-xs text-gray-400 mt-0.5">광고 카피라이팅 컬렉션</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            <Plus size={16} />
            카피 등록
          </button>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-6 flex gap-1 pb-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                tab === t.key
                  ? 'text-gray-900 bg-gray-100'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {t.label}
              {tab === t.key && copies.length > 0 && (
                <span className="ml-1.5 text-xs text-gray-500">{copies.length}</span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-48 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : copies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <p className="text-base font-medium">등록된 카피가 없습니다</p>
            <p className="text-sm mt-1">오른쪽 상단의 카피 등록 버튼을 눌러 추가해보세요</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {copies.map((copy) => (
              <CopyCard key={copy.id} copy={copy} onDeleted={fetchCopies} />
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <AddCopyModal
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false)
            fetchCopies()
          }}
        />
      )}
    </div>
  )
}
