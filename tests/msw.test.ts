import { describe, it, expect } from 'vitest';

describe('MSW', () => {
  it('mocks /api/health-check', async () => {
    const res = await fetch('http://localhost/api/health-check');
    const text = await res.text();

    expect(text).toContain('mocked by MSW');
  });
});
