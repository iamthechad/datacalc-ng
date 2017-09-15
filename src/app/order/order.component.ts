import {
  ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, Output,
  SimpleChanges, ViewChild
} from '@angular/core';
import {Category} from '../model/category';

import {Item} from '../model/item';
import {Set, Map} from 'immutable';
import {Util} from '../common/Util';

@Component({
  selector: 'mt-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderComponent implements OnChanges {
  @Input() catalog: Map<string, Category>;

  @Input() order: Map<string, Set<string>>;

  @Output() itemRemoved = new EventEmitter<{ categoryId: string, itemId: string }>();

  @ViewChild('orderTotalElement') orderTotalElement: ElementRef;

  orderTotal = 0;

  private isSafari = false;

  constructor() {
    // Ugly browser detection hack, but we only want to perform the force redraw for Safari
    const ua = window.navigator.userAgent;
    this.isSafari = ua.indexOf('Safari') !== -1 && ua.indexOf('Chrome') === -1;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const orderValue = changes.hasOwnProperty('order') ? changes.order.currentValue : this.order;
    const catalogValue = changes.hasOwnProperty('catalog') ? changes.catalog.currentValue : this.catalog;
    this.orderTotal = Util.getOrderTotal(orderValue, catalogValue);
    // Safari won't automatically redraw the total for some reason, so use this ugly hack to force it
    if (this.isSafari) {
      this.orderTotalElement.nativeElement.style.display = 'none';
      setTimeout(() => this.orderTotalElement.nativeElement.style.removeProperty('display'), 0);
    }
  }

  removeItemFromOrder(categoryId: string, itemId: string) {
    this.itemRemoved.emit({ categoryId, itemId });
  }

  getOrderCategories = (): Category[] => Util.getCategoriesForOrder(this.order, this.catalog);

  getOrderCategoryItems = (categoryId: string): Item[] => Util.getOrderCategoryItems(this.order, this.catalog, categoryId);
}
