
import { Timestamp } from 'firebase/firestore';

export type FocusSession = {
  id: string;
  duration: number;
  createdAt: Timestamp;
};

export type Win = {
  id: string;
  text: string;
  createdAt: Timestamp;
};
