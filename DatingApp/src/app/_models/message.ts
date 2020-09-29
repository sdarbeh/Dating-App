export interface Message {
  id: number;
  content: string;
  messageSent: Date;
  isRead: boolean;
  dateRead: Date;
  // sender
  senderId: number;
  senderKnownAs: string;
  senderPhotoUrl: string;
  // recipient
  recipientId: number;
  recipientKnownAs: string;
  recipientPhotoUrl: string;
}
