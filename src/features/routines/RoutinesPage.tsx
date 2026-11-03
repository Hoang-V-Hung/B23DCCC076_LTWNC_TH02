import { memo, useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useRoutineDispatch, useRoutines } from './RoutineContext';
import { getRoutineNameError } from './routineReducer';

const RoutineCreateForm = memo(function RoutineCreateForm({
  validateName,
}: { validateName: (name: string) => string }) {
  // Form chỉ đăng ký Context dispatch, không đăng ký danh sách giáo án.
  const dispatch = useRoutineDispatch();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextError = validateName(name);
    setError(nextError);
    setMessage('');
    if (nextError) {
      inputRef.current?.focus();
      return;
    }
    dispatch({ type: 'create', id: crypto.randomUUID(), name: name.trim() });
    setMessage(`Đã tạo giáo án “${name.trim()}”.`);
    setName('');
    inputRef.current?.focus();
  };

  return <form className="routine-create-form" onSubmit={handleSubmit} noValidate>
    <div className="routine-create-controls">
      <div className="field">
        <label className="field-label" htmlFor="routine-name">Tên giáo án</label>
        <input className="input" id="routine-name" ref={inputRef} value={name}
          onChange={(event) => { setName(event.target.value); setError(''); setMessage(''); }}
          placeholder="Ví dụ: Ngày ngực" autoComplete="off" aria-invalid={Boolean(error)}
          aria-describedby="routine-name-feedback" />
      </div>
      <Button variant="primary" type="submit">Tạo</Button>
    </div>
    <p id="routine-name-feedback" className="field-feedback" role={error ? 'alert' : 'status'}
      data-error={Boolean(error)}>{error || message}</p>
  </form>;
});

export default function RoutinesPage() {
  const routines = useRoutines();
  const dispatch = useRoutineDispatch();
  const routinesRef = useRef(routines);
  useEffect(() => { routinesRef.current = routines; }, [routines]);
  // Callback giữ nguyên tham chiếu; form chỉ đọc danh sách mới nhất khi submit.
  const validateName = useCallback((name: string) => getRoutineNameError(name, routinesRef.current), []);

  return <main className="page">
    <header className="page-heading">
      <h1>Giáo án</h1>
      <p>Gom bài tập theo từng buổi để bắt đầu thuận tiện hơn.</p>
    </header>
    <RoutineCreateForm validateName={validateName} />
    <section aria-label="Danh sách giáo án">
      <div className="results-line"><p className="results-count">{routines.length} giáo án</p></div>
      {routines.length ? <ul className="routine-list">
        {routines.map((routine) => <li className="routine-list-item" key={routine.id}>
          <NavLink className="routine-title" to={`/routines/${encodeURIComponent(routine.id)}`}>{routine.name}</NavLink>
          <span className="routine-item-count">{routine.exerciseIds.length} bài</span>
          <Button className="button--remove" variant="ghost" aria-label={`Xóa giáo án ${routine.name}`}
            onClick={() => dispatch({ type: 'remove', id: routine.id })}>Xóa</Button>
        </li>)}
      </ul> : <div className="empty-state">
        <h2>Chưa có giáo án nào</h2>
        <p>Đặt tên giáo án ở trên, sau đó chọn bài từ Kho bài tập.</p>
      </div>}
    </section>
  </main>;
}
