export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bibo';
}

export type Mood = 'Neutral' | 'Happy' | 'Curious' | 'Sad' | 'Surprised' | 'Wink' | 'Love';