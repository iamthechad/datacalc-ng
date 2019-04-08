import {
  ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild
} from "@angular/core";
import {Category} from "../model/category";

import {Item} from "../model/item";
import {Util} from "../common/Util";
import {Catalog} from "../model/catalog";
import {BehaviorSubject, Subject} from "rxjs";
import {OrderService} from "../service/order-service";
import {Set, Map} from "immutable";
import {take, takeUntil} from "rxjs/operators";
import {CatalogService} from "../service/catalog-service";

@Component({
  selector: "mt-order",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderComponent implements OnDestroy {
  @ViewChild("orderTotalElement") orderTotalElement: ElementRef;

  orderTotal = new BehaviorSubject<number>(0);

  order: Map<string, Set<string>>;

  private catalog: Catalog;

  private onDestroy = new Subject<void>();

  constructor(private orderService: OrderService,
              private catalogService: CatalogService) {
    this.catalogService.getCatalogObservable().pipe(
      take(1)
    ).subscribe(catalog => {
      this.catalog = catalog;
      this.listenForOrderChanges();
    });
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  removeItemFromOrder(categoryId: string, itemId: string) {
    this.orderService.removeItem(itemId, categoryId);
  }

  getOrderCategories = (): Category[] => Util.getCategoriesForOrder(this.order, this.catalog);

  getOrderCategoryItems = (categoryId: string): Item[] => Util.getOrderCategoryItems(this.order, this.catalog, categoryId);

  private listenForOrderChanges(): void {
    this.orderService.getOrderObservable().pipe(
      takeUntil(this.onDestroy)
    ).subscribe(order => {
      this.order = order;
      this.orderTotal.next(Util.getOrderTotal(order, this.catalog));
    });
  }
}
