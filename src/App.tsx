import { NavLink, Route, Routes } from 'react-router-dom';
import { ProductBrand } from './components/brand/ProductBrand';
import { ScrollbarAutohide } from './components/ui/ScrollbarAutohide';
import LibraryPage from './features/library/LibraryPage';

function PendingPage({ title }: { title: string }) {
  return <main className="page">
    <header className="page-heading"><h1>{title}</h1></header>
    <section className="empty-state" aria-label={title}>
      <h2>Chức năng chưa được triển khai</h2>
      <p>Anh có thể tiếp tục khám phá các bài tập trong kho.</p>
      <NavLink className="button button--outline" to="/">Về kho bài tập</NavLink>
    </section>
  </main>;
}

export default function App() {
  return <div className="app">
    <ScrollbarAutohide />
    <header className="app-header">
      <div className="header-inner">
        <NavLink className="brand" to="/" aria-label="Nhịp Tập - Trang chủ"><ProductBrand /></NavLink>
        <nav className="main-nav" aria-label="Điều hướng chính">
          <NavLink className="nav-item" end to="/">Kho bài tập</NavLink>
          <NavLink className="nav-item" to="/saved">Đã lưu</NavLink>
          <NavLink className="nav-item" to="/routines">Giáo án</NavLink>
        </nav>
      </div>
    </header>
    <Routes>
      <Route path="/" element={<LibraryPage />} />
      <Route path="/saved" element={<PendingPage title="Bài tập đã lưu" />} />
      <Route path="/routines" element={<PendingPage title="Giáo án" />} />
      <Route path="/routines/:id" element={<PendingPage title="Chi tiết giáo án" />} />
      <Route path="*" element={<main className="page">
        <header className="page-heading"><h1>Không tìm thấy trang</h1></header>
        <NavLink className="button button--outline" to="/">Về kho bài tập</NavLink>
      </main>} />
    </Routes>
  </div>;
}
