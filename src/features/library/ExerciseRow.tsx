import { memo } from 'react';
import type { CSSProperties } from 'react';
import { Button } from '../../components/ui/Button';
import type { Exercise } from '../../types';
import { formatDuration } from '../../utils/format';

export interface ExerciseRowProps {
  exercise: Exercise;
  index: number;
  style?: CSSProperties;
  isSaved?: boolean;
  isQueued?: boolean;
  onStart?: (exercise: Exercise) => void;
  onToggleSaved?: (id: string) => void;
  onAddToSession?: (exercise: Exercise) => void;
  showRoutineAction?: boolean;
  isInRoutine?: boolean;
  onAddToRoutine?: (exercise: Exercise) => void;
}

function ExerciseRow({
  exercise, index, style, isSaved = false, isQueued = false,
  onStart, onToggleSaved, onAddToSession,
  showRoutineAction = false, isInRoutine = false, onAddToRoutine,
}: ExerciseRowProps) {
  return <div className="exercise-row" style={style} role="listitem" aria-label={exercise.name}>
    <span className="row-number">{String(index + 1).padStart(2, '0')}</span>
    <strong className="exercise-name" title={exercise.name}>{exercise.name}</strong>
    <span className="trainer-name" title={exercise.trainer}>{exercise.trainer}</span>
    <span>{exercise.group}</span>
    <span className="duration">{formatDuration(exercise.duration)}</span>
    <div className="row-actions">
      <Button onClick={() => onStart?.(exercise)} disabled={!onStart}>Bắt đầu</Button>
      <Button variant="ghost" className={`button--icon${isSaved ? ' button--saved' : ''}`}
        onClick={() => onToggleSaved?.(exercise.id)} disabled={!onToggleSaved}
        aria-label={isSaved ? 'Bỏ lưu' : 'Lưu bài tập'} aria-pressed={isSaved}
        title={isSaved ? 'Bỏ lưu' : 'Lưu bài tập'}>{isSaved ? '★' : '☆'}</Button>
      <Button onClick={() => onAddToSession?.(exercise)} disabled={!onAddToSession || isQueued}
        title={isQueued ? 'Bài đã có trong buổi tập' : 'Thêm vào buổi tập'}>
        {isQueued ? 'Đã thêm' : '+ Buổi tập'}
      </Button>
      {showRoutineAction && <Button onClick={() => onAddToRoutine?.(exercise)}
        disabled={!onAddToRoutine || isInRoutine}
        title={isInRoutine ? 'Bài đã có trong giáo án' : onAddToRoutine ? 'Thêm vào giáo án đã chọn' : 'Tạo và chọn giáo án trước'}>
        + Giáo án
      </Button>}
    </div>
  </div>;
}

const MemoizedExerciseRow = memo(ExerciseRow);
MemoizedExerciseRow.displayName = 'ExerciseRow';
export { MemoizedExerciseRow as ExerciseRow };
