import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { RootState } from '@/store'
import { signOut } from '@/slices/authSlice'
import { NAVIGATION_TABS, SOCIAL_LINKS } from '@/configs/constants'
import toastConfig from '@/configs/toast'
import { toast } from 'react-toastify'

type AppbarProps = {
    showTopBar?: boolean // giờ mặc định không dùng topbar
}

const Appbar = ({ showTopBar = false }: AppbarProps) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user, isLogged } = useSelector((state: RootState) => state.auth)

    return (
        <header className="sticky top-0 z-[1000] flex flex-col items-center bg-[#1e1e2f] px-5 shadow-lg">
            {/* Logo + Search + Social */}
            <div className="flex h-[70px] w-full max-w-container items-center justify-between gap-4 py-2">
                <div className="flex cursor-pointer items-center gap-2" onClick={() => navigate('/')}>
                    <img src="/images/logo-comic.png" alt="logo" className="h-10" />
                    <span className="text-2xl font-bold tracking-wider text-white">MangaZone</span>
                </div>

                <div className="mx-5 flex-1">
                    <div className="relative">
                        <input type="text" placeholder="Tìm kiếm truyện..." className="w-full rounded-full py-2 pl-4 pr-10 text-sm text-gray-900" />
                        <FontAwesomeIcon icon={faSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {SOCIAL_LINKS.map(link => (
                        <Link key={link.url} to={link.url} className="text-white hover:text-secondary">
                            <FontAwesomeIcon icon={link.icon} size="lg" />
                        </Link>
                    ))}
                    {user?.avatar && (
                        <button
                            className="flex h-10 w-10 overflow-hidden rounded-full border-2 border-secondary"
                            onClick={() => navigate('/profile')}
                        >
                            <img src={user.avatar} alt="avatar" className="h-full w-full object-cover" />
                        </button>
                    )}
                    <button
                        onClick={() => {
                            if (isLogged) {
                                dispatch(signOut())
                                navigate('/')
                                toast('Đăng xuất thành công', toastConfig('success'))
                            } else {
                                navigate('/auth')
                            }
                        }}
                        className="hover:bg-secondary-dark rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-white"
                    >
                        {isLogged ? 'Đăng xuất' : 'Đăng nhập'}
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex w-full max-w-container items-center justify-center gap-8 py-2">
                {NAVIGATION_TABS.map(tab => (
                    <NavLink
                        key={tab.href}
                        to={tab.href}
                        className={({ isActive }) =>
                            `font-semibold uppercase tracking-wide hover:text-secondary ${isActive ? 'text-secondary' : 'text-white'}`
                        }
                    >
                        {tab.label}
                    </NavLink>
                ))}
            </nav>
        </header>
    )
}

export default Appbar
