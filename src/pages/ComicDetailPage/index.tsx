import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import comicService from '@/services/comicService'
import useTitle from '@/hooks/useTitle'
import dayjs from '@/libs/dayjs'

const ComicDetailPage = () => {
    useTitle('Algorit | Chi tiết truyện')
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const { comicSlug } = useParams()
    const navigate = useNavigate()
    const [activeImageIndex, setActiveImageIndex] = useState(0)

    const { getComicBySlug } = comicService({ enableFetching: true })
    const { data } = getComicBySlug(comicSlug)

    const comic = data?.data

    // 👉 tạo state riêng cho chapters
    const [chapters, setChapters] = useState<IChapter[]>([])

    useEffect(() => {
        if (comic) {
            if (comic.chapters && comic.chapters.length > 0) {
                setChapters(comic.chapters)
            }
        }
    }, [comic])

    return (
        <div className="container mx-auto p-4">
            {/* Breadcrumb */}
            <div className="mb-4 text-sm text-gray-500">
                Trang Chủ / <span className="font-semibold text-black">{comic?.title}</span>
            </div>

            {/* Header */}
            <div className="flex gap-6">
                {/* Cover */}
                <img src={comic?.coverImage} alt={comic?.title} className="h-auto w-[200px] rounded object-cover shadow-md" />

                {/* Info */}
                <div className="flex-1 space-y-2">
                    <h1 className="text-2xl font-bold">{comic?.title}</h1>

                    <div className="space-y-1 text-sm">
                        <div>
                            <b>Tác giả:</b> {comic?.author}
                        </div>
                        <div>
                            <b>Tình trạng:</b> {comic?.status}
                        </div>
                        <div>
                            <b>Lượt thích:</b> {comic?.likesCount}
                        </div>
                        <div>
                            <b>Lượt theo dõi:</b> {comic?.followersCount}
                        </div>
                        <div>
                            <b>Lượt xem:</b> {comic?.views}
                        </div>

                        {/* 📁 Thể loại */}
                        <div>
                            <b>Thể loại:</b> {comic?.genres?.join(', ')}
                        </div>

                        {/* 📅 Ngày cập nhật */}
                        <div>
                            <b>Ngày cập nhật:</b> {dayjs(comic?.updatedAt).format('DD/MM/YYYY HH:mm:ss')}
                        </div>

                        {/* 🔢 Số chương */}
                        <div>
                            <b>Số chương:</b> {chapters.length}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        {chapters.map(chapter => (
                            <button onClick={() => navigate(`/comics/${comic?.slug}/${chapter.slug}`)}
                             className="bg-green-500 text-white hover:bg-green-600">📖 Đọc từ đầu</button>
                        ))}
                        <button className="bg-pink-500 text-white hover:bg-pink-600">❤️ Theo dõi</button>
                        <button className="bg-purple-500 text-white hover:bg-purple-600">👍 Thích</button>
                    </div>
                </div>
            </div>

            {/* Giới thiệu */}
            <div className="mt-8">
                <h2 className="mb-2 text-lg font-bold text-orange-500">📘 Giới thiệu</h2>
                <p className="text-sm text-gray-700">{comic?.description}</p>
            </div>

            {/* Danh sách chương */}
            <div className="mt-8">
                <h2 className="mb-4 text-lg font-bold text-orange-500">📚 Danh sách chương</h2>
                <div className="max-h-[400px] overflow-y-auto rounded border">
                    {chapters.map(chapter => (
                        <div
                            key={chapter.id}
                            className="flex cursor-pointer justify-between border-b px-4 py-2 hover:bg-gray-100"
                            onClick={() => navigate(`/comics/${comic?.slug}/${chapter.slug}`)}
                        >
                            <span>
                                Chương {chapter.number}: {chapter.title}
                            </span>
                            <span className="text-sm text-gray-500">{dayjs(chapter.updatedAt).format('DD/MM/YYYY HH:mm')}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ComicDetailPage
