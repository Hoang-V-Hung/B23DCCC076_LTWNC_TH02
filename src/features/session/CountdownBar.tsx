import { formatDuration } from '../../utils/format';
import { useSessionStore } from './useSessionStore';

// Chỉ vùng đếm ngược này theo dõi elapsed để không render lại cả trang mỗi giây.
export function CountdownBar() {
  const elapsed = useSessionStore((state) => state.elapsed);
  const duration = useSessionStore((state) => state.queue[state.currentIndex]?.duration ?? 0);
  const remaining = Math.max(0, duration - elapsed);
  const percentage = duration ? Math.min(100, Math.round(elapsed / duration * 100)) : 0;

  return <div className="countdown">
    <div className="countdown-label">
      <span>Còn lại: <strong>{formatDuration(remaining)}</strong></span>
      <span className="countdown-percentage">{percentage}%</span>
    </div>
    <progress className="countdown-progress" value={percentage} max={100}
      aria-label="Tiến trình bài tập" aria-valuetext={`${percentage}%`} />
  </div>;
}
