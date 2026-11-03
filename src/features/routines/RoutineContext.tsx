import { createContext, useContext, useEffect, useReducer } from 'react';
import type { Dispatch, ReactNode } from 'react';
import { getRoutineNameError, routineReducer } from './routineReducer';
import type { Routine, RoutineAction } from './routineReducer';
import { withLogger } from './withLogger';

export const RoutineStateContext = createContext<Routine[] | undefined>(undefined);
export const RoutineDispatchContext = createContext<Dispatch<RoutineAction> | undefined>(undefined);

function loadRoutines(): Routine[] {
  try {
    const stored: unknown = JSON.parse(window.localStorage.getItem('workout-routines') ?? '[]');
    if (!Array.isArray(stored)) return [];
    const routines: Routine[] = [];
    for (const item of stored) {
      if (!item || typeof item !== 'object') continue;
      const candidate = item as Partial<Routine>;
      if (typeof candidate.id !== 'string' || !candidate.id || typeof candidate.name !== 'string' ||
        !Array.isArray(candidate.exerciseIds) || routines.some((routine) => routine.id === candidate.id) ||
        getRoutineNameError(candidate.name, routines)) continue;
      routines.push({
        id: candidate.id,
        name: candidate.name.trim(),
        exerciseIds: [...new Set(candidate.exerciseIds.filter((id): id is string => typeof id === 'string' && Boolean(id)))],
      });
    }
    return routines;
  } catch {
    return [];
  }
}

const loggedReducer = withLogger(routineReducer);

export function RoutineProvider({ children }: { children: ReactNode }) {
  const [routines, dispatch] = useReducer(loggedReducer, undefined, loadRoutines);

  useEffect(() => {
    try {
      window.localStorage.setItem('workout-routines', JSON.stringify(routines));
    } catch {
      // Vẫn sử dụng được giáo án trong phiên hiện tại nếu trình duyệt chặn lưu trữ.
    }
  }, [routines]);

  return <RoutineDispatchContext.Provider value={dispatch}>
    <RoutineStateContext.Provider value={routines}>{children}</RoutineStateContext.Provider>
  </RoutineDispatchContext.Provider>;
}

export function useRoutines(): Routine[] {
  const context = useContext(RoutineStateContext);
  if (context === undefined) throw new Error('useRoutines phải được dùng bên trong RoutineProvider');
  return context;
}

export function useRoutineDispatch(): Dispatch<RoutineAction> {
  const context = useContext(RoutineDispatchContext);
  if (context === undefined) throw new Error('useRoutineDispatch phải được dùng bên trong RoutineProvider');
  return context;
}
