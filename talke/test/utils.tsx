import { ReactNode, ReactElement } from 'react';
import { render as rtlRender } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { createTheme, Theme } from '@mui/material/styles';
import type { RenderResult } from '@testing-library/react';

const defaultTheme: Theme = createTheme();

interface WrapperProps {
  children: ReactNode;
  initialEntries?: string[];
}

interface CustomRenderOptions {
  initialEntries?: string[];
  [key: string]: any;
}

function Wrapper({ children, initialEntries = ['/'] }: WrapperProps): ReactElement {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </MemoryRouter>
  );
}

function render(
  ui: ReactElement,
  { initialEntries, ...options }: CustomRenderOptions = {}
): RenderResult {
  return rtlRender(ui, {
    wrapper: ({ children }: { children: ReactNode }) => (
      <Wrapper initialEntries={initialEntries}>{children}</Wrapper>
    ),
    ...options,
  });
}

export * from '@testing-library/react';
export { render };