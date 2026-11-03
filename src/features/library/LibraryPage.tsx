import { memo, useCallback, useMemo, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { areEqual, FixedSizeList } from 'react-window';
import type { ListChildComponentProps } from 'react-window';
import { EXERCISES, GROUPS } from '../../data/exercises';
import { useDebounce } from '../../hooks/useDebounce';
import type { Exercise, MuscleGroup } from '../../types';
import { ExerciseRow } from './ExerciseRow';

interface RowData {
  exercises: Exercise[];
  onStart: (exercise: Exercise) => void;
}
const VirtualRow = memo(function VirtualRow({ index, style, data }: ListChildComponentProps<RowData>) {
  return <ExerciseRow exercise={data.exercises[index]} index={index} style={style} onStart={data.onStart} />;
}, areEqual);
const itemKey = (index: number, data: RowData) => data.exercises[index].id;

export default function LibraryPage() {
  const [keyword, setKeyword] = useState('');
  const [group, setGroup] = useState<MuscleGroup | ''>('');
  const [sort, setSort] = useState('default');
  const debouncedKeyword = useDebounce(keyword, 300);
  const listRef = useRef<FixedSizeList<RowData>>(null);
  const exercises = useMemo(() => {
    const query = debouncedKeyword.trim().toLocaleLowerCase('vi');
    const result = EXERCISES.filter((exercise) =>
      (!group || exercise.group === group) &&
      (!query || exercise.name.toLocaleLowerCase('vi').includes(query) ||
        exercise.trainer.toLocaleLowerCase('vi').includes(query)));
    if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    if (sort === 'duration') result.sort((a, b) => a.duration - b.duration);
    return result;
  }, [debouncedKeyword, group, sort]);

  const handleKeywordShift = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };
  const handleStart = useCallback((_exercise: Exercise) => {
    // Nối với Zustand ở Phần 2.
  }, []);
  const itemData = useMemo<RowData>(() => ({ exercises, onStart: handleStart }), [exercises, handleStart]);

  return (
    <main className="page">
      <div className="page-heading"><div><p className="eyebrow">CHUYỂN ĐỘNG MỖI NGÀY</p>
        <h1>Kho bài tập<span className="heading-dot">.</span></h1>
        <p className="page-description">Chọn bài phù hợp. Bắt đầu nhịp tập của bạn.</p></div>
        <div className="library-total"><strong>10.000</strong><span>bài tập để khám phá</span></div></div>
      <section className="library-panel" aria-label="Kho bài tập">
        <div className="filter-bar">
          <div className="field search-field"><label htmlFor="keyword">Tìm kiếm</label>
            <input id="keyword" type="search" placeholder="Tên bài tập hoặc huấn luyện viên…"
              value={keyword} onChange={handleKeywordShift} /></div>
          <div className="field"><label htmlFor="group">Nhóm cơ</label>
            <select id="group" value={group} onChange={(event) => { setGroup(event.target.value as MuscleGroup | ''); listRef.current?.scrollToItem(0); }}>
              <option value="">Tất cả</option>{GROUPS.map((item) => <option key={item}>{item}</option>)}
            </select></div>
          <div className="field"><label htmlFor="sort">Sắp xếp</label>
            <select id="sort" value={sort} onChange={(event) => { setSort(event.target.value); listRef.current?.scrollToItem(0); }}>
              <option value="default">Mặc định</option><option value="name">Tên A–Z</option>
              <option value="duration">Thời lượng tăng dần</option></select></div>
        </div>
        <div className="results-line"><p role="status">Tìm thấy {exercises.length} bài tập</p><span>30–120 giây / bài</span></div>
        <div className="table-scroll"><div className="table-inner">
          <div className="table-heading" aria-hidden="true"><span>#</span><span>Bài tập</span><span>Huấn luyện viên</span><span>Nhóm cơ</span><span>Thời lượng</span><span>Thao tác</span></div>
          {exercises.length ? <FixedSizeList ref={listRef} height={560} itemSize={56} width="100%"
            itemCount={exercises.length} itemData={itemData} itemKey={itemKey} overscanCount={2} role="list">
            {VirtualRow}</FixedSizeList> : <div className="empty-state"><h2>Không tìm thấy bài tập nào</h2><p>Thử một từ khóa khác hoặc đổi nhóm cơ.</p></div>}
        </div></div>
      </section>
    </main>
  );
}
