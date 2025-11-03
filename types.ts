export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bibo';
}

export type Mood = 'Neutral' | 'Happy' | 'Curious' | 'Sad' | 'Surprised' | 'Wink' | 'Love' | 'Silly' | 'Cool';

export type LocationId = 'home' | 'woods' | 'caves';

export interface Location {
  id: LocationId;
  name: string;
  coords: { x: string; y: string; };
}
