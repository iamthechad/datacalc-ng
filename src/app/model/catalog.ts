import {Map} from "immutable";
import {Category} from "./category";

export interface Catalog {
  readonly entries: Map<string, Category>;
}
