import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Order} from '../model/order';
import {Category} from '../model/category';

import * as _ from 'lodash';
import {Item} from '../model/item';
import {Catalog} from '../model/catalog';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderComponent {
  @Input() catalog: Catalog;

  @Input() order: Order;

  @Output() itemRemoved = new EventEmitter<{ categoryId: string, itemId: string }>();

  removeItemFromOrder(categoryId: string, itemId: string) {
    this.itemRemoved.emit({ categoryId, itemId });
  }

  getOrderCategories(): Category[] {
    const withItems = this.order.getCategoriesWithItems();
    return _.map(withItems, id => {
      return this.catalog.getCategory(id);
    });
  }

  getOrderCategoryItems(categoryId: string): Item[] {
    const orderCategoryItemIds = this.order.getItemIdsForCategory(categoryId);
    const categoryItems = this.catalog.getCategory(categoryId).items;

    return <Item[]>_.sortBy(
      _.values(
        _.pickBy(categoryItems, item => {
          return orderCategoryItemIds.indexOf(item.id) !== -1;
        })
      ),
      ['id']);
  }

  getOrderTotal(): number {
    return _.reduce(this.getOrderCategories(), (prevTotal: number, category) => {
      const categoryTotal = _.reduce(this.getOrderCategoryItems(category.id), (itemPrevTotal: number, item: Item) => {
        return itemPrevTotal + item.value;
      }, 0);
      return prevTotal + categoryTotal;
    }, 0);
  }
}
