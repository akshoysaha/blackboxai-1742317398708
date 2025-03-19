import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ErrorPage from './ErrorPage';

describe('ErrorPage', () => {
  it('renders default error message', () => {
    render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(
      screen.getByText('An unexpected error occurred. Please try again later.')
    ).toBeInTheDocument();
  });

  it('renders custom title and message', () => {
    const title = 'Custom Error';
    const message = 'This is a custom error message';

    render(
      <MemoryRouter>
        <ErrorPage title={title} message={message} />
      </MemoryRouter>
    );

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('shows error details in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const error = new Error('Test error');
    error.stack = 'Error: Test error\n    at TestComponent';

    render(
      <MemoryRouter>
        <ErrorPage error={error} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Test error/)).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  it('shows home button when showHome is true', () => {
    render(
      <MemoryRouter>
        <ErrorPage showHome={true} />
      </MemoryRouter>
    );

    expect(screen.getByText('Go Home')).toBeInTheDocument();
  });

  it('shows retry button when showRetry is true', () => {
    render(
      <MemoryRouter>
        <ErrorPage showRetry={true} />
      </MemoryRouter>
    );

    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('hides buttons when showHome and showRetry are false', () => {
    render(
      <MemoryRouter>
        <ErrorPage showHome={false} showRetry={false} />
      </MemoryRouter>
    );

    expect(screen.queryByText('Go Home')).not.toBeInTheDocument();
    expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
  });
});