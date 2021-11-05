import {Category} from "../model/category";
import * as _ from "lodash";
import {Item} from "../model/item";
import {Catalog} from "../model/catalog";
import {Order} from "../model/order";

export class Util {
  static formatPrice(cents: number): string {
    return "$" + ( (cents / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") );
  }

  static getItemsForCategory(catalog: Catalog, categoryId: string): Item[] {
    if (catalog && catalog.hasCategory(categoryId)) {
      return _.sortBy(_.values(catalog.getCategory(categoryId).items), ["id"]);
    }

    return [];
  }

  static getCategoriesForOrder(order: Order, catalog: Catalog): Category[] {
    if (order) {
      return _.compact(order.getCategoryIds().map(id => (catalog ? catalog.getCategory(id) : null)));
    }

    return [];
  }

  static getOrderCategoryItems(order: Order, catalog: Catalog, categoryId: string): Item[] {
    const orderCategoryItemIds = order ? order.getItemsForCategory(categoryId) : new Set<string>([]);
    const categoryItems = (catalog && catalog.hasCategory(categoryId)) ? catalog.getCategory(categoryId).items : {};

    return _.sortBy(
      _.values(
        _.pickBy(categoryItems, item => orderCategoryItemIds.has(item.id))
      ),
      ["id"]);
  }

  static getOrderTotal(order: Order, catalog: Catalog): number {
    return _.reduce(Util.getCategoriesForOrder(order, catalog), (prevTotal: number, category) => {
      const categoryTotal = _.reduce(Util.getOrderCategoryItems(order, catalog, category.id), (itemPrevTotal: number, item: Item) => itemPrevTotal + item.value, 0);
      return prevTotal + categoryTotal;
    }, 0);
  }
}
