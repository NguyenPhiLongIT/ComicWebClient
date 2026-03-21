import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import comicService from '@/services/comicService'
import useTitle from '@/hooks/useTitle'
import ComicList from './ComicList'

const HomePage = () => {
    useTitle('Algorit | Trang Chủ')
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    const { getAllComicsQuery } = comicService({ enableFetching: true })
    const [searchTerm, setSearchTerm] = useState('')

    const comics = getAllComicsQuery.data?.data?.comics || []
    console.log('Comics:', comics)
    const filteredComics = comics.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()))
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Hero section */}
            <section className="bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-12 text-center text-white">
                <h1 className="text-4xl font-bold">Chào mừng đến với MangaZone 📚</h1>
                <p className="mt-2">Khám phá & đọc những bộ truyện tranh mới nhất và hay nhất!</p>

                <div className="relative mx-auto mt-6 max-w-lg">
                    <input
                        type="text"
                        placeholder="Tìm truyện bạn muốn đọc..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full rounded-full px-4 py-2 text-black shadow focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    />
                    <FontAwesomeIcon icon={faSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </section>

            {/* Comics list */}
            <section className="mx-auto max-w-6xl px-4 py-8">
                <h2 className="mb-4 text-2xl font-bold">📖 Truyện mới cập nhật</h2>
                <ComicList comics={filteredComics} />
            </section>
        </div>
    )
}

export default HomePage
