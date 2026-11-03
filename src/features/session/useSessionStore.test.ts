import { beforeEach, describe, expect, it } from 'vitest';
import { EXERCISES } from '../../data/exercises';
import { useSessionStore } from './useSessionStore';

const exercises = EXERCISES.slice(0, 3);
const state = () => useSessionStore.getState();
beforeEach(() => useSessionStore.setState({ queue: [], currentIndex: -1, isRunning: false, elapsed: 0 }));

describe('useSessionStore', () => {
  it('bắt đầu đúng bài và đặt lại thời gian về 0', () => {
    state().startSession(exercises, 1);
    expect(state()).toMatchObject({ currentIndex: 1, isRunning: true, elapsed: 0 });
    expect(state().queue[1].id).toBe('e2'); expect(state().queue).not.toBe(exercises);
  });
  it('tự chuyển sang bài sau khi tick ở giây cuối', () => {
    state().startSession(exercises, 0); useSessionStore.setState({ elapsed: 29 }); state().tick();
    expect(state()).toMatchObject({ currentIndex: 1, elapsed: 0, isRunning: true });
  });
  it('bấm Sau ở bài cuối thì dừng đồng hồ', () => {
    state().startSession(exercises, 2); state().next();
    expect(state()).toMatchObject({ currentIndex: 2, isRunning: false });
  });
  it('tạm dừng không tăng thời gian và bắt đầu lại tiếp tục từ chỗ cũ', () => {
    state().startSession(exercises, 1); state().tick(); state().toggleRun(); state().tick();
    expect(state().elapsed).toBe(1);
    state().toggleRun(); state().tick(); expect(state().elapsed).toBe(2);
  });
  it('Trước đặt lại bài nếu quá 3 giây, còn 3 giây trở xuống thì lùi bài', () => {
    state().startSession(exercises, 1); useSessionStore.setState({ elapsed: 4 }); state().prev();
    expect(state()).toMatchObject({ currentIndex: 1, elapsed: 0 });
    useSessionStore.setState({ elapsed: 3 }); state().prev();
    expect(state()).toMatchObject({ currentIndex: 0, elapsed: 0 });
    state().prev(); expect(state().currentIndex).toBe(0);
  });
  it('thêm bài không trùng ID và có thể bắt đầu hàng đợi vừa tạo', () => {
    state().addToSession(exercises[0]); state().addToSession({ ...exercises[0] }); state().addToSession(exercises[2]);
    expect(state().queue.map((exercise) => exercise.id)).toEqual(['e1', 'e3']);
    state().toggleRun(); expect(state()).toMatchObject({ currentIndex: 0, isRunning: true });
  });
  it('hoàn tất bài cuối rồi cho phép tập lại từ đầu bài đó', () => {
    state().startSession([exercises[0]], 0); useSessionStore.setState({ elapsed: 29 }); state().tick();
    expect(state()).toMatchObject({ isRunning: false, elapsed: 30 });
    state().toggleRun(); expect(state()).toMatchObject({ isRunning: true, elapsed: 0 });
  });
  it('xử lý danh sách rỗng và chặn vị trí bắt đầu ngoài phạm vi', () => {
    state().startSession([], 0); state().toggleRun(); state().next(); state().prev(); state().tick();
    expect(state()).toMatchObject({ queue: [], currentIndex: -1, isRunning: false });
    state().startSession(exercises, 99); expect(state().currentIndex).toBe(2);
    state().startSession(exercises, -1); expect(state().currentIndex).toBe(0);
    state().startSession(exercises, NaN); expect(state().currentIndex).toBe(0);
  });
});
