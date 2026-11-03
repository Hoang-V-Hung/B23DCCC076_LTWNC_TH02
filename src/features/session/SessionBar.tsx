import { useEffect, useRef } from 'react';
import { Button } from '../../components/ui/Button';
import { CountdownBar } from './CountdownBar';
import { useSessionStore } from './useSessionStore';

export function SessionBar() {
  const exercise = useSessionStore((state) => state.queue[state.currentIndex]);
  const count = useSessionStore((state) => state.queue.length);
  const isRunning = useSessionStore((state) => state.isRunning);
  const toggleRun = useSessionStore((state) => state.toggleRun);
  const prev = useSessionStore((state) => state.prev);
  const next = useSessionStore((state) => state.next);
  const tick = useSessionStore((state) => state.tick);
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isRunning) return;
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [isRunning, tick]);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    // Chừa đúng chiều cao thanh cố định, kể cả khi tên dài hoặc màn hình nhỏ.
    const updateHeight = () => {
      document.documentElement.style.setProperty('--session-bar-height', `${Math.ceil(bar.getBoundingClientRect().height)}px`);
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(bar);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty('--session-bar-height');
    };
  }, []);

  return <footer className="session-bar" ref={barRef} aria-label="Điều khiển buổi tập">
    <div className="session-inner">
      <div className="session-info">
        <p className="session-title" role="status">{exercise
          ? <>Đang tập: <strong>{exercise.name}</strong> – HLV {exercise.trainer}</>
          : 'Chưa bắt đầu buổi tập'}</p>
        <p className="session-count">Buổi tập: {count} bài</p>
      </div>
      <CountdownBar />
      <div className="session-controls" role="group" aria-label="Đồng hồ buổi tập">
        <Button onClick={prev} disabled={!exercise}>Trước</Button>
        <Button variant="primary" onClick={toggleRun} disabled={!count}
          aria-pressed={isRunning}>{isRunning ? 'Tạm dừng' : 'Bắt đầu'}</Button>
        <Button onClick={next} disabled={!exercise}>Sau</Button>
      </div>
    </div>
  </footer>;
}
