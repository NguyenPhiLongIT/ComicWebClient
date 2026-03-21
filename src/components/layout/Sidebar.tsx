import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SIDEBAR_SECTIONS } from './mangaSidebarConfig'

type SidebarProps = {
    isOpen: boolean
}

const Sidebar = ({ isOpen }: SidebarProps) => {
    return (
        <aside
            className={`fixed inset-y-0 left-0 z-40 h-screen w-64 transform bg-[#121c2d] text-white shadow-lg transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} `}
        >
            {/* Logo */}
            <div className="p-4">
                <img src="/images/logo.png" alt="logo" className="mb-4 h-8" />
            </div>

            {/* Navigation */}
            <nav className="h-[calc(100%-50px)] space-y-4 overflow-y-auto px-2 pb-4 text-sm">
                {SIDEBAR_SECTIONS.map((section, index) => (
                    <div key={section.title || index} className="space-y-2">
                        {/* Divider */}
                        {index !== 0 && <hr className="my-2 border-gray-600" />}

                        {/* Section Title */}
                        {section.title && <h4 className="mb-2 text-xs uppercase text-gray-400">{section.title}</h4>}

                        {/* Section Items */}
                        <div className={section.title === 'Thể loại' ? 'grid grid-cols-3 gap-1' : 'flex flex-col space-y-1'}>
                            {section.items.map(item => (
                                <NavLink
                                    key={item.href}
                                    to={item.href}
                                    className="flex items-center gap-2 rounded p-1 text-left text-white hover:bg-gray-700"
                                >
                                    {item.icon && <FontAwesomeIcon icon={item.icon} className="min-w-[16px]" />}
                                    <span className="text-sm">{item.label}</span>
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>
        </aside>
    )
}

export default Sidebar
