export interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export interface Story {
  id?: string;
  title: string;
  userId?: string;
  messages: Message[];
  createdAt: Date;
}
