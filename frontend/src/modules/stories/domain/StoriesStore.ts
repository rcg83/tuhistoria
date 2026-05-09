import type { StoryDefinition } from "./StoryDefinition";

export interface StoriesState {
  stories: StoryDefinition[];
  selectedStory: StoryDefinition | null;
  activeStory: StoryDefinition | null;

  isLoading: boolean;
  error: string | null;
}

export interface StoriesStore {
  state: StoriesState;

  loadStories: () => Promise<void>;
  selectStory: (story: StoryDefinition) => void;

  startStory: (id: string) => Promise<void>;
  continueStory: (id: string) => Promise<void>;

  setActiveStory: (story: StoryDefinition | null) => void;
}