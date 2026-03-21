import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'

import useAxiosIns from '@/hooks/useAxiosIns'
import { onError } from '@/utils/errorsHandler'
import { getMappedMessage } from '@/utils/resMessageMapping'
import toastConfig from '@/configs/toast'

const categoryService = ({ enableFetching }: { enableFetching: boolean }) => {
  const queryClient = useQueryClient()
  const axios = useAxiosIns()

  const [categories, setCategories] = useState<ICategory[]>([])
  const [total, setTotal] = useState<number>(0)

  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [query, setQuery] = useState<string>('')

  // 📌 Lấy danh sách categories
  const getAllCategoriesQuery = useQuery(['categories', page, limit], {
    queryFn: () =>
      axios.get<IResponseData<ICategory[]>>(
        `/categories?skip=${limit * (page - 1)}&limit=${limit}&filter=${query}`
      ),
    keepPreviousData: true,
    enabled: enableFetching,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
    refetchInterval: 10000,
    onError,
    onSuccess: res => {
      if (!res) return
      setCategories(res.data.categories)
      setTotal(res.data.total)
    }
  })

  // 📌 Lấy category theo slug
  const getCategoryBySlug = (slug?: string) => {
    return useQuery(['category-detail', slug], () => axios.get(`/categories/slug/${slug}`), {
      enabled: !!slug,
      refetchOnWindowFocus: false
    })
  }

  // 📌 Tạo category
  const createCategoryMutation = useMutation({
    mutationFn: (data: Partial<ICategory>) => {
      return axios.post<IResponseData<ICategory>>('/categories', data)
    },
    onError,
    onSuccess: res => {
      queryClient.invalidateQueries('categories')
      toast(getMappedMessage(res.data.message), toastConfig('success'))
    }
  })

  // 📌 Cập nhật category
  const updateCategoryMutation = useMutation({
    mutationFn: (payload: { categoryId: number; data: Partial<ICategory> }) => {
      return axios.patch<IResponseData<ICategory>>(
        `/categories/${payload.categoryId}`,
        payload.data
      )
    },
    onError,
    onSuccess: res => {
      queryClient.invalidateQueries('categories')
      toast(getMappedMessage(res.data.message), toastConfig('success'))
    }
  })

  // 📌 Xóa category
  const deleteCategoryMutation = useMutation({
    mutationFn: (categoryId: number) => {
      return axios.delete<IResponseData<any>>(`/categories/${categoryId}`)
    },
    onError,
    onSuccess: res => {
      queryClient.invalidateQueries('categories')
      toast(getMappedMessage(res.data.message), toastConfig('success'))
    }
  })

  return {
    categories,
    total,
    page,
    limit,
    setPage,
    setQuery,

    getAllCategoriesQuery,
    getCategoryBySlug,
    createCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation
  }
}

export default categoryService
