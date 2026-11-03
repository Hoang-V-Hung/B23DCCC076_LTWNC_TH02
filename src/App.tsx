import { lazy, Suspense } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { ProductBrand } from './components/brand/ProductBrand';
import { ScrollbarAutohide } from './components/ui/ScrollbarAutohide';
import { ThemeToggle } from './components/ui/ThemeToggle';
import LibraryPage from './features/library/LibraryPage';
import { SessionBar } from './features/session/SessionBar';

const SavedPage = lazy(() => import('./features/saved/SavedPage'));
const RoutinesPage = lazy(() => import('./features/routines/RoutinesPage'));
const RoutineDetailPage = lazy(() => import('./features/routines/RoutineDetailPage'));

export default function App() {
  return <div className="app app--with-session">
    <ScrollbarAutohide />
    <header className="app-header">
      <div className="header-inner">
        <NavLink className="brand" to="/" aria-label="Nhịp Tập - Trang chủ"><ProductBrand /></NavLink>
        <nav className="main-nav" aria-label="Điều hướng chính">
          <NavLink className="nav-item" end to="/">Kho bài tập</NavLink>
          <NavLink className="nav-item" to="/saved">Đã lưu</NavLink>
          <NavLink className="nav-item" to="/routines">Giáo án</NavLink>
          <ThemeToggle />
        </nav>
      </div>
    </header>
    <Suspense fallback={<main className="page"><p role="status">Đang tải trang...</p></main>}>
      <Routes>
      <Route path="/" element={<LibraryPage />} />
      <Route path="/saved" element={<SavedPage />} />
      <Route path="/routines" element={<RoutinesPage />} />
      <Route path="/routines/:id" element={<RoutineDetailPage />} />
      <Route path="*" element={<main className="page">
        <header className="page-heading"><h1>Không tìm thấy trang</h1></header>
        <NavLink className="button button--outline" to="/">Về kho bài tập</NavLink>
      </main>} />
      </Routes>
    </Suspense>
    <SessionBar />
  </div>;
}
