import { useCallback, useMemo } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { EXERCISE_BY_ID } from '../../data/exercises';
import { formatDuration } from '../../utils/format';
import { useSessionStore } from '../session/useSessionStore';
import { useRoutineDispatch, useRoutines } from './RoutineContext';

export default function RoutineDetailPage() {
  const { id } = useParams<{ id: string }>();
  const routines = useRoutines();
  const dispatch = useRoutineDispatch();
  const startSession = useSessionStore((state) => state.startSession);
  const routine = routines.find((item) => item.id === id);
  const exercises = useMemo(() => (routine?.exerciseIds ?? []).flatMap((exerciseId) => {
    const exercise = EXERCISE_BY_ID.get(exerciseId);
    return exercise ? [exercise] : [];
  }), [routine]);
  const totalSeconds = useMemo(() => exercises.reduce((total, exercise) => total + exercise.duration, 0), [exercises]);
  const handleStartAll = useCallback(() => {
    if (exercises.length) startSession(exercises, 0);
  }, [exercises, startSession]);

  if (!routine) return <main className="page">
    <header className="page-heading"><h1>Không tìm thấy giáo án</h1></header>
    <section className="empty-state">
      <p>Giáo án này đã bị xóa hoặc đường dẫn không đúng.</p>
      <NavLink className="button button--outline" to="/routines">Về danh sách giáo án</NavLink>
    </section>
  </main>;

  return <main className="page">
    <NavLink className="back-link" to="/routines">← Danh sách giáo án</NavLink>
    <header className="page-heading page-heading--actions">
      <div><h1>{routine.name}</h1><p>{exercises.length} bài tập trong giáo án</p></div>
      <Button variant="primary" onClick={handleStartAll} disabled={!exercises.length}>Tập tất cả</Button>
    </header>
    <section aria-label={`Bài tập trong giáo án ${routine.name}`}>
      <div className="results-line">
        <p className="results-count">Tổng thời gian: {Math.floor(totalSeconds / 60)} phút {totalSeconds % 60} giây</p>
        <NavLink className="button button--outline" to="/">Thêm bài tập</NavLink>
      </div>
      {exercises.length ? <>
        <div className="table-scroll routine-exercise-table" tabIndex={0} role="region"
          aria-label="Bảng bài tập trong giáo án, cuộn ngang để xem đủ các cột">
          <div className="table-inner" role="list" aria-label="Danh sách bài tập trong giáo án">
            <div className="table-heading" aria-hidden="true">
              <span>#</span><span>Bài tập</span><span>Huấn luyện viên</span>
              <span>Nhóm cơ</span><span>Thời lượng</span><span className="actions-heading">Thao tác</span>
            </div>
            {exercises.map((exercise, index) => <div className="exercise-row" key={exercise.id}
              role="listitem" aria-label={exercise.name}>
              <span className="row-number">{String(index + 1).padStart(2, '0')}</span>
              <strong className="exercise-name" title={exercise.name}>{exercise.name}</strong>
              <span className="trainer-name" title={exercise.trainer}>{exercise.trainer}</span>
              <span>{exercise.group}</span>
              <span className="duration">{formatDuration(exercise.duration)}</span>
              <div className="row-actions"><Button variant="ghost" className="button--remove"
                aria-label={`Bỏ ${exercise.name} khỏi giáo án`}
                onClick={() => dispatch({ type: 'removeExercise', routineId: routine.id, exerciseId: exercise.id })}>Bỏ</Button></div>
            </div>)}
          </div>
        </div>
        <p className="mobile-scroll-note">Vuốt ngang để xem đủ thông tin.</p>
      </> : <div className="empty-state">
        <h2>Giáo án chưa có bài tập</h2>
        <p>Mở Kho bài tập, chọn giáo án này rồi bấm + Giáo án ở bài muốn thêm.</p>
      </div>}
    </section>
  </main>;
}
