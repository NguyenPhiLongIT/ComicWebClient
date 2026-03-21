import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faSearch } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import comicService from '@/services/comicService'

type AppHeaderProps = {
    onToggleSidebar: () => void
    toggleBtnRef: React.RefObject<HTMLButtonElement>
}

const AppHeader = ({ onToggleSidebar, toggleBtnRef }: AppHeaderProps) => {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('')
    const [isFocused, setIsFocused] = useState(false)

    const searchBoxRef = useRef<HTMLFormElement>(null)
    const debounceRef = useRef<NodeJS.Timeout | null>(null)

    const { searchComicsQuery, buildQuery, onFilterSearch } = comicService({ enableFetching: false })

    const [suggestions, setSuggestions] = useState<any[]>([])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!searchTerm.trim()) return
        navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`)
    }

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)

        if (!searchTerm.trim()) {
            setSuggestions([])
            return
        }

        debounceRef.current = setTimeout(() => {
            if (isFocused) {
                setSuggestions([]) // clear ngay khi bắt đầu gọi mới
                buildQuery({ searchTitle: searchTerm.trim() })
                onFilterSearch()
            }
        }, 1000)

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
    }, [searchTerm, isFocused])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
                setIsFocused(false)
                setSuggestions([])
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    // theo dõi kết quả search mới về
    useEffect(() => {
        if (searchComicsQuery.isSuccess && searchComicsQuery.data?.data?.comics) {
            setSuggestions(searchComicsQuery.data.data.comics)
        }
    }, [searchComicsQuery.data])

    return (
        <header className="sticky top-0 z-40 flex flex-col bg-[#1e1e2f] px-4 py-2 text-white shadow">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button ref={toggleBtnRef} onClick={onToggleSidebar} className="text-white" title="Mở menu">
                        <FontAwesomeIcon icon={faBars} size="lg" />
                    </button>
                    <span className="text-xl font-bold text-yellow-300">MangaZone</span>
                </div>

                <form ref={searchBoxRef} onSubmit={handleSubmit} className="relative mx-4 w-full max-w-md" onFocus={() => setIsFocused(true)}>
                    <input
                        type="text"
                        placeholder="Tìm truyện bạn muốn đọc..."
                        className="w-full rounded-full py-2 pl-4 pr-10 text-black shadow focus:outline-none focus:ring-2 focus:ring-yellow-300"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-yellow-400" title="Tìm kiếm">
                        <FontAwesomeIcon icon={faSearch} />
                    </button>

                    {isFocused && suggestions.length > 0 && (
                        <div className="absolute top-full z-50 mt-1 max-h-80 w-full overflow-y-auto rounded bg-white text-black shadow-lg">
                            {suggestions.map(s => (
                                <div
                                    key={s.id}
                                    onClick={() => navigate(`/comics/${s.slug}`)}
                                    className="flex cursor-pointer gap-2 p-2 hover:bg-gray-100"
                                >
                                    <img src={s.coverImage || '/placeholder.jpg'} alt="" className="h-12 w-10 object-cover" />
                                    <div>
                                        <p className="font-bold">{s.title}</p>
                                        <p className="text-xs text-gray-500">{s.description || ''}</p>
                                        <p className="text-xs text-gray-600">
                                            👁️ {s.views} • ❤️ {s.followersCount}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </form>

                <div className="hidden items-center gap-3 md:flex">{/* avatar / profile ở đây nếu có */}</div>
            </div>
        </header>
    )
}

export default AppHeader
