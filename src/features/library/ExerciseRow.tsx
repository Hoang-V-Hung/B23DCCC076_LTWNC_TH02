import { memo } from 'react';
import type { CSSProperties } from 'react';
import { Button } from '../../components/ui/Button';
import type { Exercise } from '../../types';
import { formatDuration } from '../../utils/format';

export interface ExerciseRowProps {
  exercise: Exercise;
  index: number;
  style?: CSSProperties;
}

function ExerciseRow({ exercise, index, style }: ExerciseRowProps) {
  return <div className="exercise-row" style={style} role="listitem" aria-label={exercise.name}>
    <span className="row-number">{String(index + 1).padStart(2, '0')}</span>
    <strong className="exercise-name" title={exercise.name}>{exercise.name}</strong>
    <span className="trainer-name" title={exercise.trainer}>{exercise.trainer}</span>
    <span>{exercise.group}</span>
    <span className="duration">{formatDuration(exercise.duration)}</span>
    <div className="row-actions">
      <Button disabled title="Chức năng chưa được triển khai">Bắt đầu</Button>
      <Button variant="ghost" className="button--icon" disabled aria-label="Lưu bài tập"
        title="Chức năng chưa được triển khai">☆</Button>
      <Button disabled title="Chức năng chưa được triển khai">+ Buổi tập</Button>
    </div>
  </div>;
}

const MemoizedExerciseRow = memo(ExerciseRow);
MemoizedExerciseRow.displayName = 'ExerciseRow';
export { MemoizedExerciseRow as ExerciseRow };
