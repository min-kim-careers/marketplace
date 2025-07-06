
export interface IChatMessageChat {
  // id: number
  roomId: string;
  clientId: string;
  createdAt: string;
  read: boolean;
  isMine: boolean;
  content: any;
}
