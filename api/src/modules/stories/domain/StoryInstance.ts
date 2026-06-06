export interface StoryMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface StoryInstance {
  _id?: string;
  user: string;
  template: string | Record<string, unknown>;
  messages: StoryMessage[];
  summary?: string;
  createdAt?: Date;
}
