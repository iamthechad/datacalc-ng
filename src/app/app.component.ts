import {Component} from '@angular/core';
import {CatalogService} from './service/catalog-service';

import {Order} from './model/order';
import {Catalog} from './model/catalog';
import {OrderService} from './service/order-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Data Calculator';

  catalog: Catalog;
  order: Order;

  catalogLoaded = false;

  private currentCategory: string;

  constructor(private catalogService: CatalogService,
              private orderService: OrderService) {
    this.catalogService.getCatalogObservable().subscribe((catalog: Catalog) => {
      this.catalog = catalog;
      this.currentCategory = this.catalog.getCategoryIds()[0];
      this.catalogLoaded = true;
    });
    this.orderService.getOrderObservable().subscribe((order: Order) => this.order = order);
  }

  categorySelected(categoryId: string): void {
    this.currentCategory = categoryId;
  }

  itemSelected(itemId: string): void {
    this.order.addItem(this.currentCategory, itemId);
  }

  itemRemoved(info: { categoryId: string, itemId: string }): void {
    this.order.removeItem(info.categoryId, info.itemId);
  }

  getItemsForCurrentCategory = () => this.catalog.getItemsForCategory(this.currentCategory);

  getOrderItemsForCurrentCategory = () => this.order.getItemsForCategory(this.currentCategory);
}
