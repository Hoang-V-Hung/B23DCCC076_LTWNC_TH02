import { useCallback, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { EXERCISE_BY_ID } from '../../data/exercises';
import type { Exercise } from '../../types';
import { ExerciseRow } from '../library/ExerciseRow';
import { useSessionStore } from '../session/useSessionStore';
import { useSavedStore } from './useSavedStore';

export default function SavedPage() {
  const ids = useSavedStore((state) => state.ids);
  const toggleSaved = useSavedStore((state) => state.toggle);
  const queue = useSessionStore((state) => state.queue);
  const startSession = useSessionStore((state) => state.startSession);
  const addToSession = useSessionStore((state) => state.addToSession);
  const exercises = useMemo(() => ids.flatMap((id) => {
    const exercise = EXERCISE_BY_ID.get(id);
    return exercise ? [exercise] : [];
  }), [ids]);
  const queuedIds = useMemo(() => new Set(queue.map((exercise) => exercise.id)), [queue]);
  const handleStart = useCallback((exercise: Exercise) => {
    const index = exercises.findIndex((item) => item.id === exercise.id);
    if (index !== -1) startSession(exercises, index);
  }, [exercises, startSession]);
  const handleStartAll = useCallback(() => startSession(exercises, 0), [exercises, startSession]);

  return <main className="page">
    <header className="page-heading">
      <h1>Bài tập đã lưu</h1>
      <p>Những bài anh muốn giữ lại cho lần tập tiếp theo.</p>
    </header>
    {exercises.length ? <section aria-label="Bài tập đã lưu">
      <div className="results-line">
        <p className="results-count">Đã lưu {exercises.length} bài tập</p>
        <Button variant="primary" onClick={handleStartAll}>Tập tất cả</Button>
      </div>
      <div className="table-scroll" tabIndex={0} role="region"
        aria-label="Bảng bài tập đã lưu, cuộn ngang để xem đủ các cột">
        <div className="table-inner" role="list" aria-label="Danh sách bài tập đã lưu">
          <div className="table-heading" aria-hidden="true">
            <span>#</span><span>Bài tập</span><span>Huấn luyện viên</span>
            <span>Nhóm cơ</span><span>Thời lượng</span><span className="actions-heading">Thao tác</span>
          </div>
          {exercises.map((exercise, index) => <ExerciseRow key={exercise.id} exercise={exercise}
            index={index} isSaved isQueued={queuedIds.has(exercise.id)} onStart={handleStart}
            onToggleSaved={toggleSaved} onAddToSession={addToSession} />)}
        </div>
      </div>
      <p className="mobile-scroll-note">Vuốt ngang để xem đủ thông tin.</p>
    </section> : <section className="empty-state" aria-label="Bài tập đã lưu">
      <h2>Bạn chưa lưu bài tập nào</h2>
      <p>Bấm ngôi sao bên cạnh bài tập để lưu vào đây.</p>
      <NavLink className="button button--outline" to="/">Khám phá kho bài tập</NavLink>
    </section>}
  </main>;
}
