import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {CatalogService} from './service/catalog-service';

import {Order} from './model/order';
import {Catalog} from './model/catalog';
import {OrderService} from './service/order-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'Data Calculator';

  // I'd rather put this in a config file, but it's not really an issue for now
  projectLink = 'https://github.com/iamthechad/datacalc-ng';

  catalog: Catalog;
  order: Order;

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
    this.orderService.getOrderObservable().subscribe((order: Order) => {
      console.log(`Order changed: ${this.order === order}`);
      this.order = order;
      this.changeDetectorRef.markForCheck();
    });
  }

  categorySelected(categoryId: string): void {
    this.currentCategory = categoryId;
  }

  itemSelected(itemId: string): void {
    console.log('Adding item to order');
    this.order.addItem(this.currentCategory, itemId);
  }

  itemRemoved(info: { categoryId: string, itemId: string }): void {
    console.log('Removing item from order');
    this.order.removeItem(info.categoryId, info.itemId);
  }

  getItemsForCurrentCategory = () => this.catalog.getItemsForCategory(this.currentCategory);

  getOrderItemsForCurrentCategory = () => this.order.getItemsForCategory(this.currentCategory);
}
