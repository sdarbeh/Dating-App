import { Photo } from './photo';

export interface User {
  // user for list
  id: number;
  username: string;
  gender: string;
  age: number;
  knownAs: string;
  created: Date;
  lastActive: Date;
  city: string;
  country: string;
  photoUrl: string;

  // detailed
  interest?: string;
  bio?: string;
  lookingFor?: string;
  photos?: Photo[];
}
