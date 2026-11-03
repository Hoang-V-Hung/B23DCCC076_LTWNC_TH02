import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RoutineProvider, useRoutines } from './RoutineContext';

function ReadRoutines() {
  return <pre aria-label="Giáo án hiện tại">{JSON.stringify(useRoutines())}</pre>;
}
describe('RoutineProvider', () => {
  it('bỏ dữ liệu lỗi và tên trùng, chỉ khôi phục ID bài tập hợp lệ không trùng', () => {
    localStorage.setItem('workout-routines', JSON.stringify([null, {},
      { id: 'r1', name: ' Ngày ngực ', exerciseIds: ['e1', 'e1', 4, null] },
      { id: 'r2', name: 'ngày NGỰC', exerciseIds: [] },
    ]));
    render(<RoutineProvider><ReadRoutines /></RoutineProvider>);
    expect(JSON.parse(screen.getByLabelText('Giáo án hiện tại').textContent!)).toEqual([
      { id: 'r1', name: 'Ngày ngực', exerciseIds: ['e1'] },
    ]);
  });
  it('vẫn mở được danh sách rỗng khi localStorage chứa JSON hỏng', () => {
    localStorage.setItem('workout-routines', '{broken');
    render(<RoutineProvider><ReadRoutines /></RoutineProvider>);
    expect(screen.getByLabelText('Giáo án hiện tại')).toHaveTextContent('[]');
  });
});
