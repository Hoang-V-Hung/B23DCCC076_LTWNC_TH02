import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../test-utils';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  it('dùng icon thay chữ, đổi sang tối rồi trở về sáng và giữ nhãn truy cập', async () => {
    const user = userEvent.setup(); renderWithProviders(<ThemeToggle />);
    const moon = screen.getByRole('button', { name: 'Giao diện tối' });
    expect(moon).toHaveTextContent(''); expect(moon.querySelector('svg')).toBeInTheDocument();
    expect(moon.querySelector('circle')).not.toBeInTheDocument();
    await user.click(moon);
    const sun = screen.getByRole('button', { name: 'Giao diện sáng' });
    expect(sun.querySelector('circle')).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    await user.click(sun);
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  });
});
