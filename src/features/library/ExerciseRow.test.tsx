import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EXERCISES } from '../../data/exercises';
import { ExerciseRow } from './ExerciseRow';

const exercise = EXERCISES[0];
describe('ExerciseRow', () => {
  it('hiển thị tên bài, huấn luyện viên và thời lượng 0:30', () => {
    render(<ExerciseRow exercise={exercise} index={0} />);
    expect(screen.getByText(exercise.name)).toBeInTheDocument();
    expect(screen.getByText(exercise.trainer)).toBeInTheDocument();
    expect(screen.getByText('0:30')).toBeInTheDocument();
  });
  it('bấm Bắt đầu gọi callback với đúng bài tập', async () => {
    const onStart = vi.fn(); const user = userEvent.setup();
    render(<ExerciseRow exercise={exercise} index={0} onStart={onStart} />);
    await user.click(screen.getByRole('button', { name: 'Bắt đầu' }));
    expect(onStart).toHaveBeenCalledExactlyOnceWith(exercise);
  });
  it('nút ngôi sao đổi nhãn và gọi lưu bằng ID', async () => {
    const onToggleSaved = vi.fn(); const user = userEvent.setup();
    const { rerender } = render(<ExerciseRow exercise={exercise} index={0} onToggleSaved={onToggleSaved} />);
    await user.click(screen.getByRole('button', { name: 'Lưu bài tập' }));
    expect(onToggleSaved).toHaveBeenCalledWith('e1');
    rerender(<ExerciseRow exercise={exercise} index={0} isSaved onToggleSaved={onToggleSaved} />);
    expect(screen.getByRole('button', { name: 'Bỏ lưu' })).toHaveTextContent('★');
  });
  it('thêm bài vào buổi tập và giáo án rồi khóa khi đã có bài', async () => {
    const onAddToSession = vi.fn(), onAddToRoutine = vi.fn(); const user = userEvent.setup();
    const { rerender } = render(<ExerciseRow exercise={exercise} index={0} showRoutineAction
      onAddToSession={onAddToSession} onAddToRoutine={onAddToRoutine} />);
    await user.click(screen.getByRole('button', { name: '+ Buổi tập' }));
    await user.click(screen.getByRole('button', { name: '+ Giáo án' }));
    expect(onAddToSession).toHaveBeenCalledWith(exercise); expect(onAddToRoutine).toHaveBeenCalledWith(exercise);
    rerender(<ExerciseRow exercise={exercise} index={0} isQueued isInRoutine showRoutineAction
      onAddToSession={onAddToSession} onAddToRoutine={onAddToRoutine} />);
    expect(screen.getByRole('button', { name: 'Đã thêm' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '+ Giáo án' })).toBeDisabled();
  });
});
