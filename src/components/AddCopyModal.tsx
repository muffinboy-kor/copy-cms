'use client'

import { useState, useRef } from 'react'
import { X, ImageIcon, Type, Upload } from 'lucide-react'
import { uploadImage } from '@/lib/supabase'

type Mode = 'image' | 'text'

interface Props {
  onClose: () => void
  onSaved: () => void
}

export default function AddCopyModal({ onClose, onSaved }: Props) {
  const [mode, setMode] = useState<Mode>('text')
  const [text, setText] = useState('')
  const [company, setCompany] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!text.trim() || !company.trim()) {
      setError('카피 문구와 기업명을 입력해주세요.')
      return
    }
    if (mode === 'image' && !file) {
      setError('이미지를 선택해주세요.')
      return
    }

    setLoading(true)
    try {
      let imageUrl: string | null = null

      if (mode === 'image' && file) {
        imageUrl = await uploadImage(file)
      }

      const res = await fetch('/api/copies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, company, imageUrl, type: mode }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? '저장에 실패했습니다.')
      }

      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">카피라이팅 등록</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 px-6 pt-5">
          <button
            type="button"
            onClick={() => setMode('text')}
            className={`flex items-center gap-2 flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              mode === 'text'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <Type size={16} className="mx-auto" />
            <span>문구 작성</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('image')}
            className={`flex items-center gap-2 flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              mode === 'image'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <ImageIcon size={16} className="mx-auto" />
            <span>이미지 등록</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Image Upload */}
          {mode === 'image' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                이미지 <span className="text-red-500">*</span>
              </label>
              <div
                onClick={() => fileRef.current?.click()}
                className="cursor-pointer border-2 border-dashed border-gray-200 rounded-xl overflow-hidden hover:border-gray-400 transition-colors"
              >
                {preview ? (
                  <img src={preview} alt="preview" className="w-full max-h-56 object-contain bg-gray-50" />
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                    <Upload size={28} className="mb-2" />
                    <span className="text-sm">클릭하여 이미지 선택</span>
                    <span className="text-xs mt-1">JPG, PNG, GIF, WEBP</span>
                  </div>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
              />
            </div>
          )}

          {/* Copy Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              카피라이팅 문구 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              placeholder="카피라이팅 문구를 입력하세요"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              기업명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="기업명을 입력하세요"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-3.5 py-2.5 rounded-xl">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '저장 중...' : '저장하기'}
          </button>
        </form>
      </div>
    </div>
  )
}
