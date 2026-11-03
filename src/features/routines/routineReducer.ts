export interface Routine {
  id: string;
  name: string;
  exerciseIds: string[];
}

export type RoutineAction =
  | { type: 'create'; id: string; name: string }
  | { type: 'rename'; id: string; name: string }
  | { type: 'remove'; id: string }
  | { type: 'addExercise'; routineId: string; exerciseId: string }
  | { type: 'removeExercise'; routineId: string; exerciseId: string };

export function getRoutineNameError(name: string, routines: Routine[], exceptId?: string): string {
  const normalized = name.trim().toLocaleLowerCase('vi');
  if (!normalized) return 'Tên giáo án không được để trống';
  if (routines.some((routine) => routine.id !== exceptId && routine.name.toLocaleLowerCase('vi') === normalized)) {
    return 'Tên giáo án đã tồn tại';
  }
  return '';
}

export function routineReducer(state: Routine[], action: RoutineAction): Routine[] {
  switch (action.type) {
    case 'create':
      if (!action.id || state.some((routine) => routine.id === action.id) || getRoutineNameError(action.name, state)) return state;
      return [...state, { id: action.id, name: action.name.trim(), exerciseIds: [] }];
    case 'rename': {
      const routine = state.find((item) => item.id === action.id);
      if (!routine || routine.name === action.name.trim() || getRoutineNameError(action.name, state, action.id)) return state;
      return state.map((item) => item.id === action.id ? { ...item, name: action.name.trim() } : item);
    }
    case 'remove':
      return state.some((routine) => routine.id === action.id)
        ? state.filter((routine) => routine.id !== action.id) : state;
    case 'addExercise': {
      const routine = state.find((item) => item.id === action.routineId);
      if (!routine || !action.exerciseId || routine.exerciseIds.includes(action.exerciseId)) return state;
      return state.map((item) => item.id === action.routineId
        ? { ...item, exerciseIds: [...item.exerciseIds, action.exerciseId] } : item);
    }
    case 'removeExercise': {
      const routine = state.find((item) => item.id === action.routineId);
      if (!routine?.exerciseIds.includes(action.exerciseId)) return state;
      return state.map((item) => item.id === action.routineId
        ? { ...item, exerciseIds: item.exerciseIds.filter((id) => id !== action.exerciseId) } : item);
    }
  }
}
