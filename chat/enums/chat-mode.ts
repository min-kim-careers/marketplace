export const enum ChatMode {
  NULL = 'null',

  // Events
  CONNECTED = 'connected',
  JOINED = 'joined',
  RESTORED = 'restored',
  LEFT = 'left',
  TYPING = 'typing',
  NOT_TYPING = 'not_typing',
  LEAVE = 'leave',
  DISCONNECT = 'disconnect',
  NO_MESSAGES = 'no_messages',

  // Actions
  CHAT = 'chat',
  RESTORE = 'restore',
  JOIN = 'join',
}
