import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {Catalog} from "../model/catalog";
import {Category} from "../model/category";

import * as _ from "lodash";

@Component({
  selector: "mt-catalog",
  templateUrl: "./catalog.component.html",
  styleUrls: ["./catalog.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogComponent {

  @Input() catalog: Catalog;

  @Input() selectedCategory: string;

  @Output() categorySelected = new EventEmitter<string>();

  onCategorySelected(categoryId) {
    this.categorySelected.emit(categoryId);
  }

  getCategories(): Category[] {
    if (this.catalog) {
      return _.sortBy(_.values(this.catalog.entries.valueSeq().toArray()), ["id"]);
    }

    return [];
  }
}
