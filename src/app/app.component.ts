import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from "@angular/core";
import {CatalogService} from "./service/catalog-service";

import {OrderService} from "./service/order-service";
import {Util} from "./common/util";
import {Catalog} from "./model/catalog";
import { Item } from "./model/item";

@Component({
  selector: "mt-app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = "Data Calculator";

  // I'd rather put this in a config file, but it's not really an issue for now
  projectLink = "https://github.com/iamthechad/datacalc-ng";

  catalog: Catalog;

  catalogLoaded = false;

  private selectedCategory: string;

  constructor(private catalogService: CatalogService,
              private orderService: OrderService,
              private changeDetectorRef: ChangeDetectorRef) {
    this.catalogService.getCatalogObservable().subscribe((catalog: Catalog) => {
      this.catalog = catalog;
      this.selectedCategory = this.catalog.firstCategory.id;
      this.catalogLoaded = true;
      this.changeDetectorRef.markForCheck();
    });
  }

  categorySelected(categoryId: string): void {
    this.selectedCategory = categoryId;
  }

  itemSelected(itemId: string): void {
    this.orderService.addItem(itemId, this.selectedCategory);
  }

  getItemsForCurrentCategory = (): Item[] => Util.getItemsForCategory(this.catalog, this.selectedCategory);

  getOrderItemsForCurrentCategory = (): Set<string> => this.orderService.getItemsForCategory(this.selectedCategory);
}
