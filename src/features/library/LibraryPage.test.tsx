import { act, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../test-utils';
import { useSessionStore } from '../session/useSessionStore';
import { useSavedStore } from '../saved/useSavedStore';
import LibraryPage from './LibraryPage';

beforeEach(() => vi.spyOn(console, 'log').mockImplementation(() => {}));

describe('LibraryPage', () => {
  it('hiện 10.000 bài nhưng chỉ mount số dòng quanh vùng nhìn thấy', () => {
    renderWithProviders(<LibraryPage />);
    expect(screen.getByText('Tìm thấy 10000 bài tập')).toBeInTheDocument();
    const rows = screen.getAllByRole('listitem');
    expect(rows.length).toBeGreaterThanOrEqual(10); expect(rows.length).toBeLessThanOrEqual(15);
    expect(screen.getAllByRole('button', { name: '+ Giáo án' })[0]).toBeDisabled();
  });
  it('bắt đầu từ danh sách đã tìm và sắp xếp, bài sau vẫn nằm trong kết quả lọc', async () => {
    const user = userEvent.setup(); renderWithProviders(<LibraryPage />);
    await user.type(screen.getByRole('searchbox', { name: 'Tìm kiếm' }), 'đẩy');
    expect(await screen.findByText('Tìm thấy 1250 bài tập')).toBeInTheDocument();
    await user.click(screen.getByRole('combobox', { name: /Sắp xếp/ }));
    await user.click(screen.getByRole('option', { name: 'Thời lượng tăng dần' }));
    const firstRow = screen.getAllByRole('listitem')[0];
    await user.click(within(firstRow).getByRole('button', { name: 'Bắt đầu' }));
    const { queue } = useSessionStore.getState();
    expect(queue).toHaveLength(1250); expect(queue.every((exercise) => exercise.name.includes('Đẩy'))).toBe(true);
    expect(queue.every((exercise, index) => index === 0 || exercise.duration >= queue[index - 1].duration)).toBe(true);
    act(() => useSessionStore.getState().next());
    expect(useSessionStore.getState().currentIndex).toBe(1);
    expect(useSessionStore.getState().queue[1].name).toContain('Đẩy');
  });
  it('không tìm thấy thì có thể xóa bộ lọc để trở về toàn bộ bài', async () => {
    const user = userEvent.setup(); renderWithProviders(<LibraryPage />);
    await user.type(screen.getByRole('searchbox', { name: 'Tìm kiếm' }), 'xyz');
    expect(await screen.findByText('Không tìm thấy bài tập nào')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Xóa bộ lọc' }));
    expect(await screen.findByText('Tìm thấy 10000 bài tập')).toBeInTheDocument();
  });
  it('lọc nhóm cơ, sắp xếp tên và đặt lại cả bộ lọc', async () => {
    const user = userEvent.setup(); renderWithProviders(<LibraryPage />);
    await user.click(screen.getByRole('combobox', { name: /Nhóm cơ/ }));
    await user.click(screen.getByRole('option', { name: 'Vai' }));
    expect(screen.getByText('Tìm thấy 2000 bài tập')).toBeInTheDocument();
    await user.click(screen.getByRole('combobox', { name: /Sắp xếp/ }));
    await user.click(screen.getByRole('option', { name: 'Tên A–Z' }));
    expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('Bật nghiêng 1');
    await user.click(screen.getByRole('button', { name: 'Đặt lại' }));
    expect(screen.getByText('Tìm thấy 10000 bài tập')).toBeInTheDocument();
  });
  it('lưu bài, thêm vào buổi tập và xóa riêng từ khóa tìm kiếm', async () => {
    const user = userEvent.setup(); renderWithProviders(<LibraryPage />);
    const row = screen.getByRole('listitem', { name: 'Đẩy tạ đơn 1' });
    await user.click(within(row).getByRole('button', { name: 'Lưu bài tập' }));
    expect(useSavedStore.getState().ids).toEqual(['e1']);
    await user.click(within(row).getByRole('button', { name: '+ Buổi tập' }));
    expect(useSessionStore.getState().queue[0].id).toBe('e1');
    await user.type(screen.getByRole('searchbox', { name: 'Tìm kiếm' }), 'Đức Anh');
    expect(await screen.findByText('Tìm thấy 1000 bài tập')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Xóa tìm kiếm' }));
    expect(await screen.findByText('Tìm thấy 10000 bài tập')).toBeInTheDocument();
  });
  it('chọn giáo án đích rồi thêm bài đúng giáo án, không thêm trùng', async () => {
    const user = userEvent.setup(); renderWithProviders(<LibraryPage />, { routines: [
      { id: 'r1', name: 'Ngày ngực', exerciseIds: [] }, { id: 'r2', name: 'Ngày chân', exerciseIds: [] },
    ] });
    await user.click(screen.getByRole('combobox', { name: /Giáo án đang chọn/ }));
    await user.click(screen.getByRole('option', { name: 'Ngày chân' }));
    const row = screen.getByRole('listitem', { name: 'Đẩy tạ đơn 1' });
    await user.click(within(row).getByRole('button', { name: '+ Giáo án' }));
    expect(within(row).getByRole('button', { name: '+ Giáo án' })).toBeDisabled();
    expect(JSON.parse(localStorage.getItem('workout-routines')!)).toEqual([
      { id: 'r1', name: 'Ngày ngực', exerciseIds: [] }, { id: 'r2', name: 'Ngày chân', exerciseIds: ['e1'] },
    ]);
  });
});
