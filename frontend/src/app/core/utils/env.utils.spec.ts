import { getApiUrl } from './env.utils';
import { environment } from '../../../environments/environment';

describe('env.utils', () => {
  const originalWinEnv = (window as any).__env;

  afterEach(() => {
    (window as any).__env = originalWinEnv;
  });

  it('should return window.__env.apiUrl without trailing slashes when defined', () => {
    (window as any).__env = { apiUrl: 'https://api.example.com///' };
    expect(getApiUrl()).toBe('https://api.example.com');
  });

  it('should fallback to environment.apiUrl without trailing slashes when window.__env is missing', () => {
    delete (window as any).__env;
    const expected = environment.apiUrl.replace(/\/+$/, '');
    expect(getApiUrl()).toBe(expected);
  });
});
