import {Component, Input, ChangeDetectionStrategy, EventEmitter, Output} from '@angular/core';
import {Catalog} from '../model/catalog';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogComponent {

  @Input() catalog: Catalog;

  @Output() categorySelected = new EventEmitter<string>();

  onCategorySelected(categoryId) {
    this.categorySelected.emit(categoryId);
  }

}
