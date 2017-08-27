import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {CatalogService} from './service/catalog-service';

import {Map, List} from 'immutable';
import {Catalog} from './model/catalog';
import {OrderService} from './service/order-service';

@Component({
  selector: 'mt-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'Data Calculator';

  // I'd rather put this in a config file, but it's not really an issue for now
  projectLink = 'https://github.com/iamthechad/datacalc-ng';

  catalog: Catalog;
  order: Map<string, List<string>>;

  catalogLoaded = false;

  private currentCategory: string;

  constructor(private catalogService: CatalogService,
              private orderService: OrderService,
              private changeDetectorRef: ChangeDetectorRef) {
    this.catalogService.getCatalogObservable().subscribe((catalog: Catalog) => {
      this.catalog = catalog;
      this.currentCategory = this.catalog.getCategoryIds()[0];
      this.catalogLoaded = true;
      this.changeDetectorRef.markForCheck();
    });
    this.orderService.getOrderObservable().subscribe((order: Map<string, List<string>>) => this.order = order);
  }

  categorySelected(categoryId: string): void {
    this.currentCategory = categoryId;
  }

  itemSelected(itemId: string): void {
    this.order = this.order.set(this.currentCategory, this.order.get(this.currentCategory, List()).push(itemId));
    this.orderService.storeOrder(this.order);
  }

  itemRemoved(info: { categoryId: string, itemId: string }): void {
    let categoryItems = this.order.get(info.categoryId, List());
    const itemIndex = categoryItems.indexOf(info.itemId);
    if (itemIndex >= 0) {
      categoryItems = categoryItems.delete(itemIndex);
      if (categoryItems.isEmpty()) {
        this.order = this.order.delete(info.categoryId);
      } else {
        this.order = this.order.set(info.categoryId, categoryItems);
      }
    }
    this.orderService.storeOrder(this.order);
  }

  getItemsForCurrentCategory = () => this.catalog.getItemsForCategory(this.currentCategory);

  getOrderItemsForCurrentCategory = () => this.order.get(this.currentCategory, List());
}
