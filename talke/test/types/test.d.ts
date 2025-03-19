/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare global {
  namespace Vi {
    interface Assertion<T = any> {
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
      toHaveBeenCalledOnce(): void;
      toHaveBeenCalledWith(...args: any[]): void;
      toEqual(expected: any): void;
      toMatchObject(expected: any): void;
      toHaveLength(length: number): void;
      rejects: {
        toEqual(expected: any): void;
        toMatchObject(expected: any): void;
        toThrow(message?: string | RegExp): void;
      };
    }
  }

  interface Matchers<R = void, T = {}> extends TestingLibraryMatchers<typeof expect.stringContaining, R> {
    toHaveBeenCalledOnce(): R;
    toHaveBeenCalledWith(...args: any[]): R;
    toEqual(expected: any): R;
    toMatchObject(expected: any): R;
    toHaveLength(length: number): R;
    rejects: {
      toEqual(expected: any): R;
      toMatchObject(expected: any): R;
      toThrow(message?: string | RegExp): R;
    };
  }

  interface Window {
    ResizeObserver: ResizeObserverConstructor;
    IntersectionObserver: IntersectionObserverConstructor;
  }
}

export {};