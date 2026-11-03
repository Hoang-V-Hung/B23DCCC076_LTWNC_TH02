import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../test-utils';
import RoutinesPage from './RoutinesPage';

beforeEach(() => vi.spyOn(console, 'log').mockImplementation(() => {}));

describe('RoutinesPage', () => {
  it('bấm Tạo khi tên trống báo lỗi, nhập tên hợp lệ thì xuất hiện trong danh sách', async () => {
    const user = userEvent.setup(); renderWithProviders(<RoutinesPage />);
    await user.click(screen.getByRole('button', { name: 'Tạo' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Tên giáo án không được để trống');
    await user.type(screen.getByRole('textbox', { name: 'Tên giáo án' }), '  Ngày ngực  ');
    await user.click(screen.getByRole('button', { name: 'Tạo' }));
    expect(screen.getByRole('link', { name: 'Ngày ngực' })).toHaveAttribute('href', expect.stringContaining('/routines/'));
    expect(screen.getByRole('textbox', { name: 'Tên giáo án' })).toHaveValue('');
  });
  it('chặn tên trùng không phân biệt hoa thường sau lần tạo trước', async () => {
    const user = userEvent.setup(); renderWithProviders(<RoutinesPage />);
    const input = screen.getByRole('textbox', { name: 'Tên giáo án' });
    await user.type(input, 'Ngày ngực'); await user.click(screen.getByRole('button', { name: 'Tạo' }));
    await user.type(input, 'ngày NGỰC'); await user.click(screen.getByRole('button', { name: 'Tạo' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Tên giáo án đã tồn tại');
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });
  it('xóa đúng giáo án được chọn và giữ giáo án khác', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RoutinesPage />, { routines: [
      { id: 'r1', name: 'Ngày ngực', exerciseIds: ['e1', 'e2'] },
      { id: 'r2', name: 'Ngày chân', exerciseIds: [] },
    ] });
    const row = screen.getByRole('link', { name: 'Ngày ngực' }).closest('li')!;
    expect(within(row).getByText('2 bài')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Xóa giáo án Ngày ngực' }));
    expect(screen.queryByRole('link', { name: 'Ngày ngực' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ngày chân' })).toBeInTheDocument();
  });
  it('khôi phục giáo án đã tạo sau khi unmount và mở lại', async () => {
    const user = userEvent.setup(); const view = renderWithProviders(<RoutinesPage />);
    await user.type(screen.getByRole('textbox', { name: 'Tên giáo án' }), 'Ngày vai');
    await user.click(screen.getByRole('button', { name: 'Tạo' }));
    expect(JSON.parse(localStorage.getItem('workout-routines')!)).toEqual([
      { id: expect.any(String), name: 'Ngày vai', exerciseIds: [] },
    ]);
    view.unmount(); renderWithProviders(<RoutinesPage />);
    expect(screen.getByRole('link', { name: 'Ngày vai' })).toBeInTheDocument();
  });
});
