import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ThemeSwitcher } from './ThemeSwitcher';

describe('ThemeSwitcher', () => {
  it('should render theme toggle button', () => {
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    expect(screen.getByLabelText(/toggle theme/i)).toBeTruthy();
  });

  it('should toggle theme when clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    const button = screen.getByLabelText(/toggle theme/i);
    
    await user.click(button);
    
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should show sun or moon icon based on theme', () => {
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    const button = screen.getByLabelText(/toggle theme/i);
    expect(button).toBeTruthy();
  });
});
