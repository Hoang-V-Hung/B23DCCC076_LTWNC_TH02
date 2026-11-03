import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../test-utils';
import { useSessionStore } from '../session/useSessionStore';
import { useSavedStore } from './useSavedStore';
import SavedPage from './SavedPage';

describe('SavedPage', () => {
  it('hiện trạng thái chưa lưu bài nào', () => {
    renderWithProviders(<SavedPage />); expect(screen.getByText('Bạn chưa lưu bài tập nào')).toBeInTheDocument();
  });
  it('tập tất cả, bắt đầu từ một bài, thêm vào buổi tập và bỏ lưu', async () => {
    useSavedStore.setState({ ids: ['e1', 'e3'] }); const user = userEvent.setup();
    renderWithProviders(<SavedPage />);
    const row = screen.getByRole('listitem', { name: 'Gập tạ đơn 1' });
    await user.click(within(row).getByRole('button', { name: '+ Buổi tập' }));
    expect(useSessionStore.getState().queue.map((exercise) => exercise.id)).toEqual(['e3']);
    await user.click(screen.getByRole('button', { name: 'Tập tất cả' }));
    expect(useSessionStore.getState().queue.map((exercise) => exercise.id)).toEqual(['e1', 'e3']);
    await user.click(within(row).getByRole('button', { name: 'Bắt đầu' }));
    expect(useSessionStore.getState().currentIndex).toBe(1);
    await user.click(within(row).getByRole('button', { name: 'Bỏ lưu' }));
    expect(screen.queryByText('Gập tạ đơn 1')).not.toBeInTheDocument();
  });
});
