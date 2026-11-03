import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EXERCISES } from '../../data/exercises';
import { SessionBar } from './SessionBar';
import { useSessionStore } from './useSessionStore';

describe('SessionBar và CountdownBar', () => {
  it('hiện trạng thái chưa bắt đầu và khóa điều khiển khi hàng đợi trống', () => {
    render(<SessionBar />);
    expect(screen.getByText('Chưa bắt đầu buổi tập')).toBeInTheDocument();
    expect(screen.getByText('Buổi tập: 0 bài')).toBeInTheDocument();
    for (const button of screen.getAllByRole('button')) expect(button).toBeDisabled();
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '0');
  });
  it('đếm mỗi giây, tạm dừng giữ nguyên thời gian và đổi bài bằng Trước/Sau', () => {
    vi.useFakeTimers();
    useSessionStore.getState().startSession(EXERCISES.slice(0, 3), 1); render(<SessionBar />);
    expect(screen.getByText('1:07')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(5000)); expect(screen.getByText('1:02')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '7');
    fireEvent.click(screen.getByRole('button', { name: 'Tạm dừng' }));
    act(() => vi.advanceTimersByTime(3000)); expect(screen.getByText('1:02')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Bắt đầu' }));
    act(() => vi.advanceTimersByTime(1000)); expect(screen.getByText('1:01')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Sau' })); expect(screen.getByText('1:44')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Trước' })); expect(screen.getByText('1:07')).toBeInTheDocument();
  });
  it('dọn interval và phần khoảng trống ở đáy khi unmount', () => {
    vi.useFakeTimers(); useSessionStore.getState().startSession(EXERCISES.slice(0, 2), 0);
    const { unmount } = render(<SessionBar />);
    expect(vi.getTimerCount()).toBe(1);
    unmount(); expect(vi.getTimerCount()).toBe(0);
    expect(document.documentElement.style.getPropertyValue('--session-bar-height')).toBe('');
  });
});
