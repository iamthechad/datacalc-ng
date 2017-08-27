import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Category} from '../model/category';

import * as _ from 'lodash';
import {Item} from '../model/item';
import {Catalog} from '../model/catalog';
import {List, Map} from 'immutable';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderComponent {
  @Input() catalog: Catalog;

  @Input() order: Map<string, List<string>>;

  @Output() itemRemoved = new EventEmitter<{ categoryId: string, itemId: string }>();

  removeItemFromOrder(categoryId: string, itemId: string) {
    this.itemRemoved.emit({ categoryId, itemId });
  }

  getOrderCategories(): Category[] {
    return this.order.keySeq().toArray().sort().map(id => this.catalog.getCategory(id));
  }

  getOrderCategoryItems(categoryId: string): Item[] {
    const orderCategoryItemIds = this.order.get(categoryId, List());
    const categoryItems = this.catalog.getCategory(categoryId).items;

    return <Item[]>_.sortBy(
      _.values(
        _.pickBy(categoryItems, item => orderCategoryItemIds.indexOf(item.id) !== -1)
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
