import { useTheme } from '../../contexts/ThemeContext';
import { Button } from './Button';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return <Button className="theme-toggle" variant="ghost" onClick={toggleTheme}>
    {theme === 'light' ? 'Giao diện tối' : 'Giao diện sáng'}
  </Button>;
}
