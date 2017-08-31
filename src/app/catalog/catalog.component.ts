import {Component, Input, ChangeDetectionStrategy, EventEmitter, Output} from '@angular/core';
import {Category} from '../model/category';
import {Map} from 'immutable';
import * as _ from 'lodash';

@Component({
  selector: 'mt-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogComponent {

  @Input() catalog: Map<string, Category>;

  @Input() selectedCategory: string;

  @Output() categorySelected = new EventEmitter<string>();

  onCategorySelected(categoryId) {
    this.categorySelected.emit(categoryId);
  }

  getCategories(): Category[] {
    return _.sortBy(_.values(this.catalog.valueSeq().toArray()), ['id']);
  }
}
