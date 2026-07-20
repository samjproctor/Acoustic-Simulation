import { describe, it, expect } from 'vitest';
import { env } from '../utils/env';

describe('Environment Variables', () => {
  it('should expose appName with a default fallback', () => {
    expect(typeof env.appName).toBe('string');
    expect(env.appName.length).toBeGreaterThan(0);
  });

  it('should expose apiUrl', () => {
    expect(typeof env.apiUrl).toBe('string');
  });

  it('should expose boolean flags for isDev and isProd', () => {
    expect(typeof env.isDev).toBe('boolean');
    expect(typeof env.isProd).toBe('boolean');
    // They should not both be true
    expect(env.isDev && env.isProd).toBe(false);
  });
});
