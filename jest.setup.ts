// jest.setup.ts
import '@testing-library/jest-dom';
import { TextEncoder } from 'util';

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

global.TextEncoder = TextEncoder;
