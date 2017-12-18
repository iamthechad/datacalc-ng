import {
  ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild
} from '@angular/core';

import {Set, Map} from 'immutable';
import {Util} from '../../common/Util';
import {Catalog} from '../../model/catalog';

@Component({
  selector: 'mt-order-total',
  templateUrl: './order-total.component.html',
  styleUrls: ['./order-total.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderTotalComponent implements OnChanges {
  @Input() catalog: Catalog;

  @Input() order: Map<string, Set<string>>;

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
}
