import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageSwitcher } from './LanguageSwitcher';

describe('LanguageSwitcher', () => {
  it('should render language buttons', () => {
    render(<LanguageSwitcher />);

    expect(screen.getByLabelText(/english/i)).toBeTruthy();
    expect(screen.getByLabelText(/français/i)).toBeTruthy();
  });

  it('should switch to French', async () => {
    const user = userEvent.setup();
    
    render(<LanguageSwitcher />);

    const frenchButton = screen.getByLabelText(/français/i);
    await user.click(frenchButton);

    expect(frenchButton.className).toContain('border-primary');
  });

  it('should switch to English', async () => {
    const user = userEvent.setup();
    
    render(<LanguageSwitcher />);

    const frenchButton = screen.getByLabelText(/français/i);
    await user.click(frenchButton);

    const englishButton = screen.getByLabelText(/english/i);
    await user.click(englishButton);

    expect(englishButton.className).toContain('border-primary');
  });

  it('should display flag emojis', () => {
    render(<LanguageSwitcher />);

    expect(screen.getByText('🇬🇧')).toBeTruthy();
    expect(screen.getByText('🇫🇷')).toBeTruthy();
  });
});
