import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { RoutineProvider } from './features/routines/RoutineContext';
import type { Routine } from './features/routines/routineReducer';

export function renderWithProviders(ui: ReactElement, options: { route?: string; routines?: Routine[] } = {}) {
  if (options.routines) window.localStorage.setItem('workout-routines', JSON.stringify(options.routines));
  return render(
    <ThemeProvider>
      <RoutineProvider>
        <MemoryRouter initialEntries={[options.route ?? '/']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          {ui}
        </MemoryRouter>
      </RoutineProvider>
    </ThemeProvider>,
  );
}
