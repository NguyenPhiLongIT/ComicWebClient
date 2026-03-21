import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'

import { onError } from '@/utils/errorsHandler'
import { getMappedSort } from '@/utils/apiSortMapping'
import { getMappedMessage } from '@/utils/resMessageMapping'
import useAxiosIns from '@/hooks/useAxiosIns'
import toastConfig from '@/configs/toast'
import dayjs from 'dayjs'

export type ComicSortAndFilterParams = {
  searchTitle: string
  searchAuthor: string
  searchGenre: string
  searchStatus: string
  sort: string
  range: string[] | undefined
}

const comicService = ({ enableFetching }: { enableFetching: boolean }) => {
  const queryClient = useQueryClient()
  const axios = useAxiosIns()
  const [comics, setComics] = useState<IComic[]>([])
  const [total, setTotal] = useState<number>(0)
  const [isSearching, setIsSearching] = useState(false)

  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(8)
  const [query, setQuery] = useState<string>('')
  const [sort, setSort] = useState<string>('')
const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const buildQuery = ({
    searchTitle,
    searchAuthor,
    searchGenre,
    searchStatus,
    sort,
    range
  }: ComicSortAndFilterParams) => {
    const q: any = {}
    if (searchTitle) q.title = searchTitle.trim()
    if (searchAuthor) q.author = searchAuthor.trim()
    if (searchGenre) q.genre = searchGenre
    if (searchStatus) q.status = searchStatus
    if (range) {
      if (range[0]) q.startDate = dayjs(range[0]).format('YYYY-MM-DD')
      if (range[1]) q.endDate = dayjs(range[1]).format('YYYY-MM-DD')
    }
    setQuery(JSON.stringify(q))
    if (sort) setSort(JSON.stringify(getMappedSort(sort)))
  }
const searchComicsQuery = useQuery(
    ['search-comics', queryParams, page, limit],
    () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...queryParams,
      }).toString();

      return axios.get(`/comic?${params}`);
    },
    {
      keepPreviousData: true,
      enabled: false,
      onError,
      onSuccess: (res) => {
        setComics(res.data.comics);
        setTotal(res.data.total);
      },
    }
  );


  const getAllComicsQuery = useQuery(['comics', page, limit], {
    queryFn: () => {
      if (!isSearching) {
        // return axios.get<IResponseData<IComic[]>>(
        //   `/comics?skip=${limit * (page - 1)}&limit=${limit}`
        // )

         return axios.get<IResponseData<IComic[]>>(
          `/comic`
        )
      }
    },
    keepPreviousData: true,
    enabled: enableFetching,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
    refetchInterval: 10000,
    onError,
    onSuccess: res => {
      if (!res) return
        console.log('Fetched Comics:', res.data.comics)
      setComics(res.data.comics)
      setTotal(res.data.total as number)
    }
  })

  const getComicBySlug = (slug?: string) =>{
	return useQuery(['comic-detail', slug], () => axios.get(`/comic/slug/${slug}`), {
		enabled: !!slug,
		refetchOnWindowFocus: false,
	  });
	};

  const getChapterBySlug = (slug?: string) =>{
    return useQuery(['chapter-detail', slug], () => axios.get(`/comic/chapter/${slug}`), {
      enabled: !!slug,
      refetchOnWindowFocus: false,
      });
    };

  const getCsvComicsQuery = useQuery(['csv-comics', query, sort], {
    queryFn: () => {
      return axios.get<IResponseData<IComic[]>>(`/comics?filter=${query}&sort=${sort}`)
    },
    keepPreviousData: true,
    enabled: false,
    onError
  })

  const onFilterSearch = () => {
    setPage(1)
    setIsSearching(true)
    setTimeout(() => searchComicsQuery.refetch(), 300)
  }

  const onResetFilterSearch = () => {
    setPage(1)
    setIsSearching(false)
    setQuery('')
    setSort('')
    setTimeout(() => getAllComicsQuery.refetch(), 300)
  }

  useEffect(() => {
    if (isSearching) {
      searchComicsQuery.refetch()
    }
  }, [page])

  const createNewComicMutation = useMutation({
    mutationFn: (data: Partial<IComic>) => {
      return axios.post<IResponseData<IComic>>('/comic/create', data)
    },
    onError,
    onSuccess: res => {
      queryClient.invalidateQueries(isSearching ? 'search-comics' : 'comics')
      toast(getMappedMessage(res.data.message), toastConfig('success'))
    }
  })

  const addNewChapterMutation = useMutation({
    mutationFn: (data: Partial<IComic>) => {
      return axios.post<IResponseData<IComic>>('/comic/add-chapter', data)
    },
    onError,
    onSuccess: res => {
      queryClient.invalidateQueries(isSearching ? 'search-comics' : 'comics')
      toast(getMappedMessage(res.data.message), toastConfig('success'))
    }
  })

  const updateComicMutation = useMutation({
    mutationFn: (payload: { comicId: number; data: Partial<IComic> }) => {
      return axios.patch<IResponseData<IComic>>(`/comics/${payload.comicId}`, payload.data)
    },
    onError,
    onSuccess: res => {
      queryClient.invalidateQueries(isSearching ? 'search-comics' : 'comics')
      toast(getMappedMessage(res.data.message), toastConfig('success'))
    }
  })

  const deleteComicMutation = useMutation({
    mutationFn: (comicId: number) => {
      return axios.delete<IResponseData<any>>(`/comics/${comicId}`)
    },
    onError,
    onSuccess: res => {
      queryClient.invalidateQueries(isSearching ? 'search-comics' : 'comics')
      toast(getMappedMessage(res.data.message), toastConfig('success'))
    }
  })

  return {
    comics,
    total,
    page,
    limit,
    setPage,
    onFilterSearch,
    onResetFilterSearch,
    buildQuery,

    searchComicsQuery,
    getAllComicsQuery,
	  getComicBySlug,
    getChapterBySlug,
    getCsvComicsQuery,
    createNewComicMutation,
    addNewChapterMutation,
    updateComicMutation,
    deleteComicMutation
  }
}

export default comicService