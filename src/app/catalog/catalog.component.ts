import {Component, OnInit, Input, ChangeDetectionStrategy, EventEmitter, Output} from '@angular/core';
import {Catalog} from "../model/catalog";

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogComponent implements OnInit {

  @Input()
  catalog: Catalog;

  @Output() onCategorySelected = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
    console.log('catalog?', this.catalog);
  }

  getCategories() {
    console.log('getCategories');
    return this.catalog.categories.values();
  }

  categorySelected(categoryId) {
    this.onCategorySelected.emit(categoryId);
  }

}
