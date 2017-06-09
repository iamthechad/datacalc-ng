import {Component, OnInit, Input, ChangeDetectionStrategy, EventEmitter, Output} from '@angular/core';
import {Catalog} from "../model/catalog";

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogComponent {

  @Input()
  catalog: Catalog;

  @Output() onCategorySelected = new EventEmitter<string>();

  categorySelected(categoryId) {
    console.log('Category selected', categoryId);
    this.onCategorySelected.emit(categoryId);
  }

}
