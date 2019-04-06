import {
  ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, Output,
  SimpleChanges, ViewChild
} from "@angular/core";
import {Category} from "../model/category";

import {Item} from "../model/item";
import {Set, Map} from "immutable";
import {Util} from "../common/Util";
import {Catalog} from "../model/catalog";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: "mt-order",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderComponent implements OnChanges {
  @Input() catalog: Catalog;

  @Input() order: Map<string, Set<string>>;

  @Output() itemRemoved = new EventEmitter<{ categoryId: string, itemId: string }>();

  @ViewChild("orderTotalElement") orderTotalElement: ElementRef;

  orderTotal = new BehaviorSubject<number>(0);

  ngOnChanges(changes: SimpleChanges): void {
    const orderValue = changes.hasOwnProperty("order") ? changes.order.currentValue : this.order;
    const catalogValue = changes.hasOwnProperty("catalog") ? changes.catalog.currentValue : this.catalog;
    this.orderTotal.next(Util.getOrderTotal(orderValue, catalogValue));
  }

  removeItemFromOrder(categoryId: string, itemId: string) {
    this.itemRemoved.emit({ categoryId, itemId });
  }

  getOrderCategories = (): Category[] => Util.getCategoriesForOrder(this.order, this.catalog);

  getOrderCategoryItems = (categoryId: string): Item[] => Util.getOrderCategoryItems(this.order, this.catalog, categoryId);
}
