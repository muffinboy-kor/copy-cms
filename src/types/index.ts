export type CopyType = 'image' | 'text'

export interface Copy {
  id: string
  text: string
  company: string
  imageUrl: string | null
  type: CopyType
  createdAt: string
  updatedAt: string
}
