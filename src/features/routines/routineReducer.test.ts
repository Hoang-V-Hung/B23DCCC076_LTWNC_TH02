import { describe, expect, it } from 'vitest';
import { routineReducer } from './routineReducer';
import type { Routine } from './routineReducer';

const initial: Routine[] = [{ id: 'r1', name: 'Ngày ngực', exerciseIds: ['e1'] }];

describe('routineReducer', () => {
  it('tạo giáo án mới, cắt khoảng trắng và không sửa state gốc', () => {
    const state: Routine[] = [];
    expect(routineReducer(state, { type: 'create', id: 'r1', name: ' Ngày ngực ' }))
      .toEqual([{ id: 'r1', name: 'Ngày ngực', exerciseIds: [] }]);
    expect(state).toEqual([]);
  });
  it('không tạo tên trống, tên trùng khác hoa thường hoặc ID trùng', () => {
    expect(routineReducer(initial, { type: 'create', id: 'r2', name: ' ' })).toBe(initial);
    expect(routineReducer(initial, { type: 'create', id: 'r2', name: 'ngày NGỰC' })).toBe(initial);
    expect(routineReducer(initial, { type: 'create', id: 'r1', name: 'Ngày chân' })).toBe(initial);
  });
  it('thêm bài mới đúng thứ tự và bỏ qua bài trùng', () => {
    const state = routineReducer(initial, { type: 'addExercise', routineId: 'r1', exerciseId: 'e2' });
    expect(state[0].exerciseIds).toEqual(['e1', 'e2']);
    expect(initial[0].exerciseIds).toEqual(['e1']);
    expect(routineReducer(state, { type: 'addExercise', routineId: 'r1', exerciseId: 'e1' })).toBe(state);
  });
  it('bỏ đúng bài khỏi giáo án và giữ các giáo án khác', () => {
    const other: Routine = { id: 'r2', name: 'Ngày chân', exerciseIds: ['e2'] };
    const result = routineReducer([...initial, other], { type: 'removeExercise', routineId: 'r1', exerciseId: 'e1' });
    expect(result[0].exerciseIds).toEqual([]); expect(result[1]).toBe(other);
  });
  it('xóa giáo án không tồn tại thì state không thay đổi', () => {
    expect(routineReducer(initial, { type: 'remove', id: 'missing' })).toEqual(initial);
    expect(routineReducer(initial, { type: 'remove', id: 'missing' })).toBe(initial);
  });
  it('xóa đúng giáo án theo ID', () => {
    expect(routineReducer(initial, { type: 'remove', id: 'r1' })).toEqual([]);
  });
  it('đổi tên nhưng từ chối tên trống hoặc trùng với giáo án khác', () => {
    const state = [...initial, { id: 'r2', name: 'Ngày chân', exerciseIds: [] }];
    expect(routineReducer(state, { type: 'rename', id: 'r1', name: ' Ngực A ' })[0].name).toBe('Ngực A');
    expect(routineReducer(state, { type: 'rename', id: 'r1', name: 'ngày CHÂN' })).toBe(state);
    expect(routineReducer(state, { type: 'rename', id: 'r1', name: ' ' })).toBe(state);
  });
  it('bỏ qua thao tác với giáo án hoặc bài không tồn tại', () => {
    expect(routineReducer(initial, { type: 'rename', id: 'missing', name: 'Khác' })).toBe(initial);
    expect(routineReducer(initial, { type: 'addExercise', routineId: 'missing', exerciseId: 'e2' })).toBe(initial);
    expect(routineReducer(initial, { type: 'removeExercise', routineId: 'r1', exerciseId: 'missing' })).toBe(initial);
  });
});
