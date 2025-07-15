export const enum ChatMode {
  NULL = 'null',

  // Events
  CONNECTED = 'connected',
  JOINED = 'joined',
  RESTORED = 'restored',
  LEFT = 'left',
  EMPTY = 'empty',
  TYPING = 'typing',
  NOT_TYPING = 'not_typing',
  LEAVE = 'leave',
  DISCONNECT = 'disconnect',

  // Actions
  CHAT = 'chat',
  RESTORE = 'restore',
  JOIN = 'join',
}
