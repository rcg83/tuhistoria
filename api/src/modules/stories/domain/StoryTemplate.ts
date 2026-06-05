export interface StoryEvent {
  messageNumber: number;
  prompt: string;
}

export interface StoryTemplate {
  id?: string;
  title: string;
  description: string;
  initialText: string;
  imageUrl?: string;
  events?: StoryEvent[];
}
