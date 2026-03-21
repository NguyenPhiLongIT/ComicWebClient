import {
  faBookOpen, faUser, faUserPlus, faFire, faClock,
  faStar, faHeart, faSearch,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons'
type SidebarItem = {
  label: string
  href: string
  icon?: IconDefinition // <-- optional
}
export const SIDEBAR_SECTIONS: {
  title: string | null
  items: SidebarItem[]
}[] = [
  {
    title: null,
    items: [
      { label: 'Chế độ đọc Manga', href: '/', icon: faBookOpen },
      { label: 'Đăng nhập', href: '/login', icon: faUser },
      { label: 'Đăng ký', href: '/register', icon: faUserPlus }
    ]
  },
  {
    title: null,
    items: [
      { label: 'Truyện mới', href: '/latest', icon: faFire },
      { label: 'Lịch sử đọc', href: '/history', icon: faClock },
      { label: 'Truyện nổi bật', href: '/featured', icon: faStar },
      { label: 'Top theo dõi', href: '/follow', icon: faHeart },
      { label: 'Tìm truyện nâng cao', href: '/search', icon: faSearch }
    ]
  },
  {
    title: 'Thể loại',
    items: [
      { label: '16+', href: '/genres/16plus' },
      { label: '18+', href: '/genres/18plus' },
      { label: 'Âu Cổ', href: '/genres/au-co' },
      { label: 'Bá Đạo', href: '/genres/ba-dao' },
      { label: 'Bách Hợp', href: '/genres/bach-hop' },
      { label: 'Báo Thù', href: '/genres/bao-thu' },
      { label: 'Bệnh Kiều', href: '/genres/benh-kieu' },
      { label: 'Cung Đấu', href: '/genres/cung-dau' },
      { label: 'Dị Giới', href: '/genres/di-gioi' },
      { label: 'Drama', href: '/genres/drama' }
    ]
  }
]
