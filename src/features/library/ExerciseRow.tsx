import { memo } from 'react';
import type { CSSProperties } from 'react';
import type { Exercise } from '../../types';
import { formatDuration } from '../../utils/format';

export interface ExerciseRowProps {
  exercise: Exercise;
  index: number;
  style?: CSSProperties;
  onStart: (exercise: Exercise) => void;
  isSaved?: boolean;
  isQueued?: boolean;
  isInRoutine?: boolean;
  canAddToRoutine?: boolean;
  onToggleSaved?: (id: string) => void;
  onAddToSession?: (exercise: Exercise) => void;
  onAddToRoutine?: (exercise: Exercise) => void;
}

export const ExerciseRow = memo(function ExerciseRow({
  exercise, index, style, onStart, isSaved = false, isQueued = false,
  isInRoutine = false, canAddToRoutine = false,
  onToggleSaved, onAddToSession, onAddToRoutine,
}: ExerciseRowProps) {
  return (
    <div className="exercise-row" style={style} role="listitem" aria-label={exercise.name}>
      <span className="row-number">{String(index + 1).padStart(2, '0')}</span>
      <div className="exercise-identity">
        <strong title={exercise.name}>{exercise.name}</strong>
        <span className="mobile-trainer">{exercise.trainer}</span>
      </div>
      <span className="trainer-name">{exercise.trainer}</span>
      <span className="muscle-group">{exercise.group}</span>
      <span className="duration">{formatDuration(exercise.duration)}</span>
      <div className="row-actions">
        <button className="start-button" onClick={() => onStart(exercise)}>Bắt đầu</button>
        <button className={`save-button ${isSaved ? 'is-saved' : ''}`}
          aria-label={isSaved ? 'Bỏ lưu' : 'Lưu bài tập'} aria-pressed={isSaved}
          onClick={() => onToggleSaved?.(exercise.id)}>{isSaved ? '★' : '☆'}</button>
        <button disabled={isQueued} title={isQueued ? 'Đã có trong buổi tập' : 'Thêm vào buổi tập'}
          onClick={() => onAddToSession?.(exercise)}>+ Buổi tập</button>
        <button disabled={!canAddToRoutine || isInRoutine}
          title={!canAddToRoutine ? 'Tạo và chọn giáo án trước' : isInRoutine ? 'Đã có trong giáo án' : 'Thêm vào giáo án'}
          onClick={() => onAddToRoutine?.(exercise)}>+ Giáo án</button>
      </div>
    </div>
  );
});
