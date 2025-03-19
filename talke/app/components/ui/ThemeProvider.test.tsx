import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { ThemeProvider, useTheme } from './ThemeProvider';

// Test component to access theme context
function TestComponent() {
  const { mode, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-mode">{mode}</span>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should provide light theme by default', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
  });

  it('should toggle theme when button is clicked', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const button = screen.getByText('Toggle Theme');
    
    // Initial state
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');

    // First toggle
    fireEvent.click(button);
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');

    // Second toggle
    fireEvent.click(button);
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
  });

  it('should persist theme preference in localStorage', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const button = screen.getByText('Toggle Theme');
    
    // Toggle to dark mode
    fireEvent.click(button);
    expect(localStorage.getItem('theme-mode')).toBe('dark');

    // Toggle back to light mode
    fireEvent.click(button);
    expect(localStorage.getItem('theme-mode')).toBe('light');
  });

  it('should initialize with system preference when no stored preference', () => {
    // Mock system dark mode preference
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
  });

  it('should initialize with stored preference over system preference', () => {
    // Set stored preference
    localStorage.setItem('theme-mode', 'light');

    // Mock system dark mode preference
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
  });
});