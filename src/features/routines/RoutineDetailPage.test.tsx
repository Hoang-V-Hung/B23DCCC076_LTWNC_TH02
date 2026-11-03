import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Route, Routes } from 'react-router-dom';
import { renderWithProviders } from '../../test-utils';
import { useSessionStore } from '../session/useSessionStore';
import RoutineDetailPage from './RoutineDetailPage';

beforeEach(() => vi.spyOn(console, 'log').mockImplementation(() => {}));
const page = <Routes><Route path="/routines/:id" element={<RoutineDetailPage />} /></Routes>;

describe('RoutineDetailPage', () => {
  it('tính 1 phút 37 giây, tập đúng thứ tự và cập nhật tổng khi bỏ bài', async () => {
    const user = userEvent.setup(); renderWithProviders(page, {
      route: '/routines/r1', routines: [{ id: 'r1', name: 'Ngày ngực', exerciseIds: ['e1', 'e2'] }],
    });
    expect(screen.getByText('Tổng thời gian: 1 phút 37 giây')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Tập tất cả' }));
    expect(useSessionStore.getState().queue.map((exercise) => exercise.id)).toEqual(['e1', 'e2']);
    expect(useSessionStore.getState()).toMatchObject({ currentIndex: 0, isRunning: true });
    await user.click(screen.getByRole('button', { name: 'Bỏ Đẩy tạ đơn 1 khỏi giáo án' }));
    expect(screen.getByText('Tổng thời gian: 1 phút 7 giây')).toBeInTheDocument();
    expect(screen.queryByText('Đẩy tạ đơn 1')).not.toBeInTheDocument();
  });
  it('giáo án rỗng khóa Tập tất cả và hiển thị hướng dẫn thêm bài', () => {
    renderWithProviders(page, { route: '/routines/r1', routines: [{ id: 'r1', name: 'Ngày ngực', exerciseIds: [] }] });
    expect(screen.getByRole('button', { name: 'Tập tất cả' })).toBeDisabled();
    expect(screen.getByText('Giáo án chưa có bài tập')).toBeInTheDocument();
  });
  it('báo không tìm thấy khi ID giáo án không tồn tại', () => {
    renderWithProviders(page, { route: '/routines/missing' });
    expect(screen.getByRole('heading', { name: 'Không tìm thấy giáo án' })).toBeInTheDocument();
  });
});
