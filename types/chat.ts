export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  type: 'text' | 'image';
  mediaUri?: string | null;
  thumbnailUri?: string | null;
  mimeType?: string | null;
  sizeBytes?: number | null;
  status?: 'sent' | 'read';
  editedAt?: number | null;
  deletedAt?: number | null;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: Message;
}


