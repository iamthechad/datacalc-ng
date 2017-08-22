import {Item} from './item';

export interface Category {
  id: string;
  name: string;
  icon: string;
  items: { [key: string]: Item };
}
