export const enum ChatMode {
  INITIALIZING = 'initializing',

  // Flags
  CONNECTED = 'connected',
  JOINED = 'joined',
  RESTORED = 'restored',
  LEFT = 'left',
  EMPTY = 'empty',
  TYPING = 'typing',
  NOT_TYPING = 'not_typing',

  // Actions
  CHAT = 'chat',
  RESTORE = 'restore',
  JOIN = 'join',
  LEAVE = 'leave',
  DISCONNECT = 'disconnect',
}
