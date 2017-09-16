import {Category} from '../model/category';
import {Set, Map} from 'immutable';
import * as _ from 'lodash';
import {Item} from '../model/item';
import {Catalog} from '../model/catalog';

export class Util {
  static formatPrice(cents: number): string {
    return '$' + ( (cents / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') );
  }

  static getItemsForCategory(catalog: Catalog, categoryId: string): Item[] {
    if (catalog && catalog.entries.has(categoryId)) {
      return _.sortBy(_.values(catalog.entries.get(categoryId).items), ['id']);
    }

    return [];
  }

  static getCategoriesForOrder(order: Map<string, Set<string>>, catalog: Catalog): Category[] {
    if (order) {
      return _.compact(order.keySeq().toArray().sort().map(id => (catalog ? catalog.entries.get(id) : null)));
    }

    return [];
  }

  static getOrderCategoryItems(order: Map<string, Set<string>>, catalog: Catalog, categoryId: string): Item[] {
    const orderCategoryItemIds = order ? order.get(categoryId, Set()) : Set();
    const categoryItems = (catalog && catalog.entries.has(categoryId)) ? catalog.entries.get(categoryId).items : [];

    return <Item[]>_.sortBy(
      _.values(
        _.pickBy(categoryItems, item => orderCategoryItemIds.contains(item.id))
      ),
      ['id']);
  }

  static getOrderTotal(order: Map<string, Set<string>>, catalog: Catalog): number {
    return _.reduce(Util.getCategoriesForOrder(order, catalog), (prevTotal: number, category) => {
      const categoryTotal = _.reduce(Util.getOrderCategoryItems(order, catalog, category.id), (itemPrevTotal: number, item: Item) => {
        return itemPrevTotal + item.value;
      }, 0);
      return prevTotal + categoryTotal;
    }, 0);
  }
}
