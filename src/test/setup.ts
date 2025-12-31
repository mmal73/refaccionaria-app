import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock global crypto for UUIDs in tests
if (typeof global.crypto === 'undefined') {
  (global as any).crypto = {
    randomUUID: () => 'test-uuid-' + Math.random(),
  };
}

// Global mocks if needed
vi.stubGlobal('jest', {
  fn: vi.fn,
});
