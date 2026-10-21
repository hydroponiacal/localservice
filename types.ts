
export interface ServiceProvider {
  name: string;
  rating: number;
  reviews: number;
  category: string;
  address: string;
  phone: string;
  description: string;
  url: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export enum ImageSize {
  K1 = '1K',
  K2 = '2K',
  K4 = '4K'
}

// Define the AIStudio interface to match the environment's expected global type.
export interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    // The global aistudio property must use the AIStudio interface type.
    aistudio: AIStudio;
  }
}
