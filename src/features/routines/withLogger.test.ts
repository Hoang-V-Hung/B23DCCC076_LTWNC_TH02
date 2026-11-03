import { describe, expect, it, vi } from 'vitest';
import { withLogger } from './withLogger';

describe('withLogger', () => {
  it('ghi tên action và state trước sau trong dev, giữ nguyên kết quả reducer', () => {
    vi.stubEnv('DEV', true); const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const reducer = withLogger((state: number, action: { type: string; amount: number }) => state + action.amount);
    expect(reducer(2, { type: 'addExercise', amount: 1 })).toBe(3);
    expect(log).toHaveBeenCalledWith('[Giáo án] addExercise', expect.objectContaining({ previousState: 2, nextState: 3 }));
  });
  it('không ghi log khi tắt chế độ dev', () => {
    vi.stubEnv('DEV', false); const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    expect(withLogger((state: number, _action: { type: string }) => state)(2, { type: 'remove' })).toBe(2);
    expect(log).not.toHaveBeenCalled();
  });
});
