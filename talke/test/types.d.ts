/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

declare namespace Vi {
  interface Assertion {
    toBeInTheDocument(): void;
    toHaveStyle(style: Record<string, any>): void;
    toBeVisible(): void;
    toBeDisabled(): void;
    toHaveClass(className: string): void;
    toHaveAttribute(attr: string, value?: string): void;
    toHaveTextContent(text: string | RegExp): void;
    toHaveValue(value: string | number | string[]): void;
    toBeChecked(): void;
    toBePartiallyChecked(): void;
    toHaveFocus(): void;
    toBeEmpty(): void;
    toBeEmptyDOMElement(): void;
    toBeInvalid(): void;
    toBeRequired(): void;
    toBeValid(): void;
    toContainElement(element: HTMLElement | null): void;
    toContainHTML(html: string): void;
    toHaveAccessibleDescription(description?: string | RegExp): void;
    toHaveAccessibleName(name?: string | RegExp): void;
    toHaveDisplayValue(value: string | RegExp | Array<string | RegExp>): void;
    toHaveErrorMessage(message?: string | RegExp): void;
    toHaveFormValues(values: Record<string, any>): void;
  }

  interface AsymmetricMatchersContaining {
    toBeInTheDocument(): void;
    toHaveStyle(style: Record<string, any>): void;
    toBeVisible(): void;
    toBeDisabled(): void;
    toHaveClass(className: string): void;
    toHaveAttribute(attr: string, value?: string): void;
    toHaveTextContent(text: string | RegExp): void;
    toHaveValue(value: string | number | string[]): void;
    toBeChecked(): void;
    toBePartiallyChecked(): void;
    toHaveFocus(): void;
    toBeEmpty(): void;
    toBeEmptyDOMElement(): void;
    toBeInvalid(): void;
    toBeRequired(): void;
    toBeValid(): void;
    toContainElement(element: HTMLElement | null): void;
    toContainHTML(html: string): void;
    toHaveAccessibleDescription(description?: string | RegExp): void;
    toHaveAccessibleName(name?: string | RegExp): void;
    toHaveDisplayValue(value: string | RegExp | Array<string | RegExp>): void;
    toHaveErrorMessage(message?: string | RegExp): void;
    toHaveFormValues(values: Record<string, any>): void;
  }
}

declare module 'vitest' {
  interface Assertion extends Vi.Assertion {}
  interface AsymmetricMatchersContaining extends Vi.AsymmetricMatchersContaining {}
}

// Extend window with test-specific properties
interface Window {
  ResizeObserver: ResizeObserverConstructor;
  IntersectionObserver: IntersectionObserverConstructor;
}