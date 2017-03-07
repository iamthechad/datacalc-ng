import {Component, OnInit, Input} from '@angular/core';
import {Catalog} from "../model/catalog";

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  @Input()
  catalog: Catalog;

  constructor() { }

  ngOnInit() {
    console.log('catalog?', this.catalog);
  }

  getCategories() {
    console.trace('getCategories');
    return this.catalog.categories.values();
  }

}
