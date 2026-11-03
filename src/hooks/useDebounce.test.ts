import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  it('giữ giá trị cũ trước 300ms và chỉ cập nhật sau đủ 300ms', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), { initialProps: { value: '' } });
    rerender({ value: 'đẩy' });
    act(() => vi.advanceTimersByTime(299));
    expect(result.current).toBe('');
    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe('đẩy');
  });
  it('hủy lịch cũ khi gõ tiếp và dọn timer khi unmount', () => {
    vi.useFakeTimers();
    const { result, rerender, unmount } = renderHook(({ value }) => useDebounce(value, 300), { initialProps: { value: 0 } });
    rerender({ value: 1 }); act(() => vi.advanceTimersByTime(200));
    rerender({ value: 2 }); act(() => vi.advanceTimersByTime(100));
    expect(result.current).toBe(0);
    act(() => vi.advanceTimersByTime(200)); expect(result.current).toBe(2);
    rerender({ value: 3 }); unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
