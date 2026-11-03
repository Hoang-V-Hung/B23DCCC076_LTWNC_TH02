import { describe, expect, it } from 'vitest';
import { useSavedStore } from './useSavedStore';

describe('useSavedStore', () => {
  it('bật tắt lưu theo ID và chỉ ghi ids vào workout-saved', () => {
    useSavedStore.getState().toggle('e1'); useSavedStore.getState().toggle('e3');
    expect(JSON.parse(localStorage.getItem('workout-saved')!).state).toEqual({ ids: ['e1', 'e3'] });
    useSavedStore.getState().toggle('e1'); expect(useSavedStore.getState().ids).toEqual(['e3']);
  });
  it('khôi phục ID sau tải lại và lọc phần tử sai kiểu hoặc trùng', async () => {
    localStorage.setItem('workout-saved', JSON.stringify({ state: { ids: ['e1', 5, 'e1', 'e3'] }, version: 0 }));
    await useSavedStore.persist.rehydrate();
    expect(useSavedStore.getState().ids).toEqual(['e1', 'e3']);
    expect(useSavedStore.getState().toggle).toBeTypeOf('function');
  });
});
