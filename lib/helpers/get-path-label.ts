import { APP_ROUTES } from '@/lib/constants/app-routes';


export const getPathLabel = (path: string) => {
  const splitPath = path.split('/');
  const route = Object.values(APP_ROUTES).find((r) => {
    const splitHref = r.href.split('/');
    return splitHref.every((h, i) => splitPath[i] === h);
  });
  if (!route) throw new Error('Route not found');
  return route.label;
};
