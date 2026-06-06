export interface StoryEvent {
  messageNumber: number;
  prompt: string;
}

export interface StoryTemplate {
  _id?: string;
  title: string;
  description: string;
  initialText: string;
  imageUrl?: string;
  events?: StoryEvent[];
}
