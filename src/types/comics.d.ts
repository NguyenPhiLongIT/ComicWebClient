declare global {
    export interface ICategory {
  id: string
  name: string
  slug: string
}

export interface IComic {
  id: string
  title: string
  slug: string
  description: string
  coverImage: string
  views: number
  status: 'ONGOING' | 'COMPLETED' | 'PAUSED' | string // có thể liệt kê rõ hơn nếu backend cố định
  author: string
  createdAt: string // hoặc: Date nếu muốn parse về Date
  updatedAt: string
  categories: ICategory[]
  followersCount: number
}

}
export {}
