export interface StoryMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface StoryInstance {
  id?: string;
  user: string;
  template: string | Record<string, unknown>;
  messages: StoryMessage[];
  createdAt?: Date;
}
