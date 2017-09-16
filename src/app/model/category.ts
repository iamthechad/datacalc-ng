import {Item} from './item';

export interface Category {
  readonly id: string;
  readonly name: string;
  readonly icon: string;
  readonly items: { [key: string]: Item };
}
