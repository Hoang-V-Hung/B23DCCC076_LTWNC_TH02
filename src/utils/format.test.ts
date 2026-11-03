import { describe, expect, it } from 'vitest';
import { formatDuration } from './format';

describe('formatDuration', () => {
  it.each([[0, '0:00'], [67, '1:07'], [120, '2:00']])('định dạng %i giây thành %s', (seconds, expected) => {
    expect(formatDuration(seconds)).toBe(expected);
  });
  it('làm tròn xuống và đưa giá trị âm hoặc không hữu hạn về 0', () => {
    expect(formatDuration(67.9)).toBe('1:07');
    for (const value of [-1, NaN, Infinity]) expect(formatDuration(value)).toBe('0:00');
  });
});
