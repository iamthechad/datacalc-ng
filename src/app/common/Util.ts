import {Category} from '../model/category';
import {Map} from 'immutable';
import * as _ from 'lodash';

export class Util {
  static formatPrice(cents: number): string {
    return '$' + ( (cents / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') );
  }

  static getItemsForCategory(catalog: Map<string, Category>, categoryId: string) {
    if (catalog) {
      return _.sortBy(_.values(catalog.get(categoryId).items), ['id']);
    }

    return [];
  }
}
