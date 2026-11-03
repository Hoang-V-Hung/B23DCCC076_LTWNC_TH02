import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { areEqual, FixedSizeList } from 'react-window';
import type { ListChildComponentProps } from 'react-window';
import { Button } from '../../components/ui/Button';
import { SelectField } from '../../components/ui/SelectField';
import type { SelectOption } from '../../components/ui/SelectField';
import { EXERCISES, GROUPS } from '../../data/exercises';
import { useDebounce } from '../../hooks/useDebounce';
import type { Exercise, MuscleGroup } from '../../types';
import { ExerciseRow } from './ExerciseRow';

type SortOrder = 'default' | 'name' | 'duration';

const MUSCLE_OPTIONS: SelectOption<MuscleGroup | ''>[] = [
  { value: '', label: 'Tất cả' },
  ...GROUPS.map((group) => ({ value: group, label: group })),
];
const SORT_OPTIONS: SelectOption<SortOrder>[] = [
  { value: 'default', label: 'Mặc định' },
  { value: 'name', label: 'Tên A–Z' },
  { value: 'duration', label: 'Thời lượng tăng dần' },
];

interface RowData { exercises: Exercise[] }

const VirtualRow = memo(function VirtualExerciseRow({ index, style, data }: ListChildComponentProps<RowData>) {
  return <ExerciseRow exercise={data.exercises[index]} index={index} style={style} />;
}, areEqual);
VirtualRow.displayName = 'VirtualRow';

const itemKey = (index: number, data: RowData) => data.exercises[index].id;

export default function LibraryPage() {
  const [keyword, setKeyword] = useState('');
  const [group, setGroup] = useState<MuscleGroup | ''>('');
  const [sort, setSort] = useState<SortOrder>('default');
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

  const itemData = useMemo<RowData>(() => ({ exercises }), [exercises]);
  useEffect(() => { listRef.current?.scrollToItem(0); }, [exercises]);

  const handleKeywordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  }, []);
  const handleClearKeyword = useCallback(() => setKeyword(''), []);
  const handleGroupChange = useCallback((value: MuscleGroup | '') => setGroup(value), []);
  const handleSortChange = useCallback((value: SortOrder) => setSort(value), []);
  const handleResetFilters = useCallback(() => {
    setKeyword(''); setGroup(''); setSort('default');
  }, []);
  const hasFilters = Boolean(keyword || group || sort !== 'default');

  return <main className="page">
    <header className="page-heading">
      <h1>Kho bài tập</h1>
      <p>Tìm bài theo tên, huấn luyện viên hoặc nhóm cơ.</p>
    </header>

    <section className="library" aria-label="Kho bài tập">
      <div className="filter-bar">
        <div className="field search-field">
          <label className="field-label" htmlFor="keyword">Tìm kiếm</label>
          <div className="search-control">
            <input className="input" id="keyword" type="search" value={keyword}
              onChange={handleKeywordChange} placeholder="Tên bài tập hoặc huấn luyện viên"
              autoComplete="off" spellCheck={false} />
            {keyword && <Button variant="ghost" className="search-clear" aria-label="Xóa tìm kiếm"
              onClick={handleClearKeyword}>×</Button>}
          </div>
        </div>
        <SelectField id="group" label="Nhóm cơ" value={group}
          options={MUSCLE_OPTIONS} onChange={handleGroupChange} />
        <SelectField id="sort" label="Sắp xếp" value={sort}
          options={SORT_OPTIONS} onChange={handleSortChange} />
      </div>

      <div className="results-line">
        <p role="status" className="results-count">Tìm thấy {exercises.length} bài tập</p>
        <div className="results-actions">
          <span className="results-meta">30–120 giây mỗi bài</span>
          <Button variant="ghost" className="reset-filters" onClick={handleResetFilters}
            data-hidden={!hasFilters} aria-hidden={!hasFilters} disabled={!hasFilters}>Đặt lại</Button>
        </div>
      </div>

      <div className="table-scroll" data-empty={!exercises.length}
        tabIndex={exercises.length ? 0 : undefined} role="region"
        aria-label={exercises.length ? 'Bảng bài tập, cuộn ngang để xem đủ các cột' : 'Kết quả tìm kiếm'}>
        <div className="table-inner" role={exercises.length ? 'list' : undefined} aria-label="Danh sách bài tập">
          <div className="table-heading" aria-hidden="true">
            <span>#</span><span>Bài tập</span><span>Huấn luyện viên</span>
            <span>Nhóm cơ</span><span>Thời lượng</span><span className="actions-heading">Thao tác</span>
          </div>
          {exercises.length ? <FixedSizeList ref={listRef} height={560} itemSize={56} width="100%"
            itemCount={exercises.length} itemData={itemData} itemKey={itemKey} overscanCount={2}>
            {VirtualRow}
          </FixedSizeList> : <div className="empty-state library-empty">
            <h2>Không tìm thấy bài tập nào</h2>
            <p>Thử một từ khóa khác hoặc đổi nhóm cơ.</p>
            <Button onClick={handleResetFilters}>Xóa bộ lọc</Button>
          </div>}
        </div>
      </div>
      <p className="mobile-scroll-note">Vuốt ngang để xem đủ thông tin.</p>
    </section>
  </main>;
}
