import { useState, useRef, useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import AppHeader from '@/components/layout/AppHeader'
import Footer from '@/components/layout/Footer'
import Sidebar from '@/components/layout/Sidebar'

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const sidebarRef = useRef<HTMLDivElement>(null)
    const toggleBtnRef = useRef<HTMLButtonElement>(null)

    const handleClickOutside = (event: MouseEvent) => {
        if (
            isSidebarOpen &&
            sidebarRef.current &&
            !sidebarRef.current.contains(event.target as Node) &&
            toggleBtnRef.current &&
            !toggleBtnRef.current.contains(event.target as Node)
        ) {
            setIsSidebarOpen(false)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isSidebarOpen])

    const handleToggleSidebar = () => {
        setIsSidebarOpen(prev => !prev)
    }

    return (
        <div className="flex h-screen flex-col">
            {/* Header */}
            <AppHeader onToggleSidebar={handleToggleSidebar} toggleBtnRef={toggleBtnRef} />

            {/* Content */}
            <div className="relative flex flex-1">
                {/* Sidebar */}
                {isSidebarOpen && (
                    <div ref={sidebarRef} className="fixed inset-y-0 left-0 z-40 w-64">
                        <Sidebar isOpen={isSidebarOpen} />
                    </div>
                )}

                {/* Overlay */}
                {isSidebarOpen && <div className="fixed inset-0 z-30 bg-black/50" onClick={() => setIsSidebarOpen(false)} />}

                {/* Main Content */}
                <main className="relative z-10 flex-1 overflow-y-auto bg-gray-50 p-4">
                    <Outlet />
                </main>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    )
}

export default MainLayout
