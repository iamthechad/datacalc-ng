import {Category} from '../model/category';
import {Set, Map} from 'immutable';
import * as _ from 'lodash';
import {Item} from '../model/item';

export class Util {
  static formatPrice(cents: number): string {
    return '$' + ( (cents / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') );
  }

  static getItemsForCategory(catalog: Map<string, Category>, categoryId: string) {
    if (catalog && catalog.has(categoryId)) {
      return _.sortBy(_.values(catalog.get(categoryId).items), ['id']);
    }

    return [];
  }

  static getCategoriesForOrder(order: Map<string, Set<string>>, catalog: Map<string, Category>): Category[] {
    if (order) {
      return _.compact(order.keySeq().toArray().sort().map(id => (catalog ? catalog.get(id) : null)));
    }

    return [];
  }

  static getOrderCategoryItems(order: Map<string, Set<string>>, catalog: Map<string, Category>, categoryId: string): Item[] {
    const orderCategoryItemIds = order ? order.get(categoryId, Set()) : Set();
    const categoryItems = (catalog && catalog.has(categoryId)) ? catalog.get(categoryId).items : [];

    return <Item[]>_.sortBy(
      _.values(
        _.pickBy(categoryItems, item => orderCategoryItemIds.contains(item.id))
      ),
      ['id']);
  }

  static getOrderTotal(order: Map<string, Set<string>>, catalog: Map<string, Category>): number {
    return _.reduce(Util.getCategoriesForOrder(order, catalog), (prevTotal: number, category) => {
      const categoryTotal = _.reduce(Util.getOrderCategoryItems(order, catalog, category.id), (itemPrevTotal: number, item: Item) => {
        return itemPrevTotal + item.value;
      }, 0);
      return prevTotal + categoryTotal;
    }, 0);
  }
}
