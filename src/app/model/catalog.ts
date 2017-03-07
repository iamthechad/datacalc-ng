import {Category} from "./category";
import {Item} from "./item";
export interface Catalog {
  categories: Map<string, Category>;
  items: Item[];
}
