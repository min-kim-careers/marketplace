export enum ChatMessageMode {
  // Flags
  CONNECTED = 'connected',
  JOINED = 'joined',
  RESTORED = 'restored',
  LEFT = 'left',
  EMPTY = 'empty',

  // Actions
  CHAT = 'chat',
  RESTORE = 'restore',
  JOIN = 'join',
  LEAVE = 'leave',
  DISCONNECT = 'disconnect',
}
