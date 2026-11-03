const BUILD_TAG = "wk-5182";
import { NavLink, Route, Routes } from 'react-router-dom';
import LibraryPage from './features/library/LibraryPage';

export default function App() {
  return <div className="app" data-build-tag={BUILD_TAG}>
    <header className="app-header"><div className="header-inner">
      <NavLink className="brand" to="/" aria-label="Nhịp Tập - Trang chủ"><span className="brand-symbol" aria-hidden="true">Ⅱ</span>nhịp tập<span className="brand-dot">.</span></NavLink>
      <nav aria-label="Điều hướng chính"><NavLink end to="/">Kho bài tập</NavLink><NavLink to="/saved">Đã lưu</NavLink><NavLink to="/routines">Giáo án</NavLink></nav>
    </div></header>
    <Routes><Route path="/" element={<LibraryPage />} />
      <Route path="/saved" element={<main className="page"><h1>Bài tập đã lưu</h1></main>} />
      <Route path="/routines" element={<main className="page"><h1>Giáo án</h1></main>} />
      <Route path="/routines/:id" element={<main className="page"><h1>Chi tiết giáo án</h1></main>} />
    </Routes>
  </div>;
}
