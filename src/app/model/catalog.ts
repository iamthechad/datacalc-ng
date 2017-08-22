import {Category} from './category';
import * as _ from 'lodash';
import {Item} from './item';

export class Catalog {
  constructor(private categories: { [key: string]: Category }) {
  }

  getCategories(): Category[] {
    return _.sortBy(_.values(this.categories), ['id']);
  }

  getCategory(categoryId: string): Category {
    return this.categories[categoryId];
  }

  getCategoryIds(): string[] {
    return _.keys(this.categories).sort();
  }

  getItemsForCategory(categoryId: string): Item[] {
    const category = this.categories[categoryId];
    return _.sortBy(_.values(category.items), ['id']);
  }
}
