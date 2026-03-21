import { Link } from 'react-router-dom'
import { formatTime } from '@/utils/timeFormat'

type ComicListProps = {
    comics: IComic[]
}

const ComicList = ({ comics }: ComicListProps) => {
    if (!comics?.length) {
        return <p className="text-center text-gray-500">Không tìm thấy truyện nào.</p>
    }

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {comics.map(comic => (
                <Link key={comic.id} to={`/comics/${comic.slug}`} className="overflow-hidden rounded bg-white shadow transition hover:shadow-md">
                    <img src={comic.coverImage || '/images/logo.png'} alt={comic.title} className="h-52 w-full object-cover" />
                    <div className="space-y-1 p-2">
                        <h3 className="truncate text-md font-semibold">{comic.title}</h3>
                        <p className="text-sm text-gray-500">
                            👁️ {comic.views} • ❤️ {comic.followersCount}
                        </p>
                        <p className="text-xs capitalize text-gray-500">Trạng thái: {comic.status?.toLowerCase() || 'unknown'}</p>
                        <p className="text-sm text-gray-500">Cập nhật: {formatTime(comic.updatedAt)}</p>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default ComicList
