export type UserProfile = {
  uid: string;
  displayName: string;
  email: string;
  coupleId: string | null;
  outfitColor: string;
  createdAt: number;
};

export type Couple = {
  id: string;
  inviteCode: string;
  members: string[];
  coins: number;
  createdAt: number;
};

export type Moment = {
  id: string;
  senderId: string;
  imageUrl: string;
  storagePath?: string;
  caption: string;
  createdAt: number;
  expiresAt: number;
  viewedBy: string[];
};

export type Idea = {
  id: string;
  text: string;
  createdBy: string;
  createdAt: number;
  done: boolean;
};

export type Plant = {
  id: string;
  kind: 'rose' | 'tulip' | 'cactus' | 'sunflower' | 'tree';
  plantedAt: number;
  lastWateredAt: number;
};

export type FurnitureItem = {
  id: string;
  kind: string;
  x: number;
  y: number;
};

export type Outfit = { color: string; hat: string; outfit: string };

export type WorldState = {
  coins: number;
  roomLevel: number;
  plants: Plant[];
  furniture: FurnitureItem[];
  outfits: Record<string, Outfit>;
};

export type TruthOrDareState = {
  turn: string;
  currentCardId: string | null;
  usedCardIds: string[];
};

export type QuizState = {
  currentQuestionId: string | null;
  askedQuestionIds: string[];
  answers: Record<string, Record<string, string>>;
  revealed: boolean;
};

export type PictionaryStroke = {
  color: string;
  points: number[];
};

export type PictionaryState = {
  drawerId: string;
  word: string | null;
  strokes: PictionaryStroke[];
  status: 'waiting' | 'drawing' | 'guessed';
  lastGuess: { uid: string; text: string; correct: boolean } | null;
  round: number;
};
