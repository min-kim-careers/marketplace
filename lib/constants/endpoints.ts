import { env } from "../utils/env";

export const ENDPOINTS = {
  AUTH: env.serverUrl + '/auth',
  USERS: env.serverUrl + '/users',
  ITEMS: env.serverUrl + '/items',
}