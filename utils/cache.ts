import { User } from '@/utils/supabase/types/user';

const USER_CACHE_KEY = 'userCache';

const getUserCache = (): { [key: string]: User } => {
  const cache = localStorage.getItem(USER_CACHE_KEY);
  return cache ? JSON.parse(cache) : {};
};

const setUserCache = (cache: { [key: string]: User }) => {
  localStorage.setItem(USER_CACHE_KEY, JSON.stringify(cache));
};

export const getUserFromCache = (email: string): User | null => {
  const cache = getUserCache();
  return cache[email] || null;
};

export const setUserInCache = (email: string, user: User): void => {
  const cache = getUserCache();
  cache[email] = user;
  setUserCache(cache);
};

export const removeUserFromCache = (email: string): void => {
  const cache = getUserCache();
  delete cache[email];
  setUserCache(cache);
};