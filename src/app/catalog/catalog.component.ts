import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output} from "@angular/core";
import {Catalog} from "../model/catalog";
import {Category} from "../model/category";

import {CatalogService} from "../service/catalog-service";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: "mt-catalog",
  templateUrl: "./catalog.component.html",
  styleUrls: ["./catalog.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogComponent implements OnDestroy {

  @Input() selectedCategory: string;

  @Output() categorySelected = new EventEmitter<string>();

  private catalog: Catalog;

  private onDestroy = new Subject<void>();

  constructor(private catalogService: CatalogService) {
    this.catalogService.getCatalogObservable().pipe(
      takeUntil(this.onDestroy)
    ).subscribe(catalog => this.catalog = catalog);
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  onCategorySelected(categoryId) {
    this.categorySelected.emit(categoryId);
  }

  getCategories(): Category[] {
    return this.catalog.getCategories();
  }

  translateIcon(rawIcon: string): string {
    switch (rawIcon) {
      case "icon-coin-dollar":
        return "fa-dollar-sign";
      case "icon-user":
        return "fa-user";
      case "icon-library":
        return "fa-balance-scale";
      case "icon-profile":
        return "fa-id-card";
      case "icon-flag":
        return "fa-flag";
      default:
        return "";
    }
  }
}
