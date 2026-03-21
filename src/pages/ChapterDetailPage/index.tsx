import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import comicService from '@/services/comicService'
import useTitle from '@/hooks/useTitle'
import dayjs from '@/libs/dayjs'

const ComicDetailPage = () => {
    useTitle('Algorit | Chi tiết chương')
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const { chapterSlug } = useParams()
    const navigate = useNavigate()
    const [activeImageIndex, setActiveImageIndex] = useState(0)

    const { getChapterBySlug } = comicService({ enableFetching: true })
    const { data } = getChapterBySlug(chapterSlug)

    const chapter = data?.data

    // 👉 tạo state riêng cho chapters
    const [comments, setComments] = useState<IComment[]>([])

    useEffect(() => {
        if (chapter) {
            if (chapter.comments && chapter.comments.length > 0) {
                setComments(chapter.comments)
            }
        }
    }, [chapter])

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="mb-4 text-sm text-gray-500">
                <Link to="/" className="hover:underline">Trang Chủ</Link>
                {' / '}
                <Link to={`/comics/${chapter?.comicSlug}`} className="font-semibold text-black hover:underline">{chapter?.comicTitle}</Link>
                {' / '}
                <span className="font-semibold text-black">{chapter?.title}</span>
            </div>
            {chapter ? (
                <>
                    {/* Tiêu đề chương */}
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-bold">{chapter.title}</h1>
                        <p className="text-sm text-gray-500">
                            Cập nhật lúc {dayjs(chapter.createdAt).format('DD/MM/YYYY HH:mm')}
                        </p>
                    </div>

                    {/* Danh sách trang đọc truyện */}
                    <div className="flex flex-col gap-4">
                        {chapter.pages.map((page) => (
                            <img
                                key={page.pageNum}
                                src={page.imageUrl}
                                alt={`Trang ${page.pageNum}`}
                                className="w-full rounded shadow"
                            />
                        ))}
                    </div>

                    {/* Bình luận */}
                    <div className="mt-10">
                        <h2 className="text-xl font-semibold mb-4">Bình luận ({comments.length})</h2>

                        {comments.length > 0 ? (
                            <ul className="space-y-4">
                                {comments.map((comment) => (
                                    <li key={comment.id} className="p-3 border rounded shadow-sm">
                                        <p className="text-sm font-semibold">{comment.user?.username || 'Ẩn danh'}</p>
                                        <p>{comment.content}</p>
                                        <p className="text-xs text-gray-500">
                                            {dayjs(comment.createdAt).format('HH:mm DD/MM/YYYY')}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">Chưa có bình luận nào.</p>
                        )}
                    </div>
                </>
            ) : (
                <div className="text-center py-10 text-gray-500">Đang tải chương...</div>
            )}
        </div>
    )
}

export default ComicDetailPage
