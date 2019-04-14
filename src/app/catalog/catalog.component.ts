import {ChangeDetectionStrategy, Component, EventEmitter, Inject, OnDestroy, Output} from "@angular/core";
import {Catalog} from "../model/catalog";
import {Category} from "../model/category";

import {CatalogService} from "../service/catalog-service";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {IconTranslateService, IconTranslateServiceToken} from "../service/icon-translate.service";

@Component({
  selector: "mt-catalog",
  templateUrl: "./catalog.component.html",
  styleUrls: ["./catalog.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogComponent implements OnDestroy {

  @Output() categorySelected = new EventEmitter<string>();

  selectedCategory: string;

  private catalog: Catalog;

  private onDestroy = new Subject<void>();

  get categories(): Category[] {
    return this.catalog.getCategories();
  }

  constructor(private catalogService: CatalogService,
              @Inject(IconTranslateServiceToken) private iconTranslateService: IconTranslateService) {
    this.catalogService.getCatalogObservable().pipe(
      takeUntil(this.onDestroy)
    ).subscribe(catalog => {
      this.catalog = catalog;
      this.selectedCategory = this.catalog.firstCategory.id;
    });
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  onCategorySelected(categoryId) {
    this.selectedCategory = categoryId;
    this.categorySelected.emit(categoryId);
  }

  translateIcon(rawIcon: string): string {
    return this.iconTranslateService.translateIcon(rawIcon);
  }
}
