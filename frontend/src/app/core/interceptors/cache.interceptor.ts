import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, tap } from 'rxjs';

interface CacheEntry {
  response: HttpResponse<any>;
  expiry: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5000; // 5 seconds

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    // Invalidate the cache for mutations
    // For simplicity, we clear all caches to ensure data consistency
    cache.clear();
    return next(req);
  }

  const cached = cache.get(req.urlWithParams);
  const now = Date.now();

  if (cached) {
    if (now < cached.expiry) {
      return of(cached.response);
    } else {
      // Remove expired cache entry
      cache.delete(req.urlWithParams);
    }
  }

  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        cache.set(req.urlWithParams, {
          response: event,
          expiry: Date.now() + CACHE_TTL
        });
      }
    })
  );
};
