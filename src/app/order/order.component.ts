import {
  ChangeDetectionStrategy, Component, EventEmitter, Input, Output
} from '@angular/core';
import {Category} from '../model/category';

import {Item} from '../model/item';
import {Set, Map} from 'immutable';
import {Util} from '../common/Util';
import {Catalog} from '../model/catalog';

@Component({
  selector: 'mt-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderComponent {
  @Input() catalog: Catalog;

  @Input() order: Map<string, Set<string>>;

  @Output() itemRemoved = new EventEmitter<{ categoryId: string, itemId: string }>();

  removeItemFromOrder(categoryId: string, itemId: string) {
    this.itemRemoved.emit({ categoryId, itemId });
  }

  getOrderCategories = (): Category[] => Util.getCategoriesForOrder(this.order, this.catalog);

  getOrderCategoryItems = (categoryId: string): Item[] => Util.getOrderCategoryItems(this.order, this.catalog, categoryId);
}
