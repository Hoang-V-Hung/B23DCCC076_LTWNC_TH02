import { describe, expect, it } from 'vitest';
import { generateExercises } from './exercises';

describe('generateExercises', () => {
  it('sinh đủ 10.000 bài có ID duy nhất và thời lượng từ 30 đến 120 giây', () => {
    const exercises = generateExercises(10000);
    expect(exercises).toHaveLength(10000);
    expect(new Set(exercises.map((exercise) => exercise.id)).size).toBe(10000);
    expect(exercises.every((exercise) => exercise.duration >= 30 && exercise.duration <= 120)).toBe(true);
    expect(exercises[0]).toMatchObject({ id: 'e1', name: 'Đẩy tạ đơn 1', duration: 30 });
    expect(exercises[1].duration).toBe(67);
  });
});
