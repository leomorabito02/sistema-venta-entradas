import { environment } from '../../../environments/environment';

function trimTrailingSlashes(url: string): string {
  let end = url.length;
  while (end > 0 && url.codePointAt(end - 1) === 47) {
    end--;
  }
  return url.substring(0, end);
}

export function getApiUrl(): string {
  const win = typeof window !== 'undefined' ? (window as any) : null;
  const envUrl = win?.__env?.apiUrl;
  if (typeof envUrl === 'string' && envUrl.trim() !== '') {
    return trimTrailingSlashes(envUrl.trim());
  }
  return environment.apiUrl ? trimTrailingSlashes(environment.apiUrl) : '';
}
