import {Component} from '@angular/core';
import {AngularFireDatabase, FirebaseObjectObservable} from "angularfire2/database";
import {Catalog} from "./model/catalog";
import {Category} from "./model/category";
import {Item} from "./model/item";

import * as _ from "lodash";
import {Order} from "./model/order";
import {SelectableItem} from "./model/selectable-item";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = "Data Calculator";

  item: FirebaseObjectObservable<any[]>;

  catalog: Catalog;
  order: Order;

  catalogLoaded = false;

  private currentCategory: string;

  constructor(ad: AngularFireDatabase) {
    this.item = ad.object('/catalog');
    this.item.subscribe(snapshot => this.buildCatalog(snapshot));
  }

  categorySelected(categoryId: string) {
    this.currentCategory = categoryId;
  }

  itemSelected(itemId: string) {
    this.order.selection[this.currentCategory].push(itemId);
  }

  itemRemoved(info: { categoryId: string, itemId: string }) {
    _.remove(this.order.selection[info.categoryId], itemId => itemId === info.itemId);
  }

  getItemsForCurrentCategory(): SelectableItem[] {
    if (this.currentCategory && this.catalogLoaded) {
      const categoryItems = this.catalog.getItemsForCategory(this.currentCategory);
      const orderItems = this.order.selection[this.currentCategory];
      return _.map(categoryItems, item => _.assign({}, item, { selected: orderItems.indexOf(item.id) !== -1 }));
    }
    return [];
  }

  private buildCatalog(snapshot) {
    const categoryMap: { [key: string]: Category } = {};
    _.forEach(snapshot.categories, (snapshotCategory: Category, id) => {
      categoryMap[id] = _.merge({ items: {}, id }, snapshotCategory);
    });

    _.forEach(snapshot.items, (snapshotItem: Item, id) => {
      categoryMap[snapshotItem.category].items[id] = _.merge({id}, snapshotItem);
    });

    this.catalog = new Catalog(categoryMap);
    const categoryIds = this.catalog.getCategoryIds();

    this.order = {
      selection: <{ [key: string]: string[] }>_.assign({}, ..._.map(categoryIds, id => ({ [id]: [] })))
    };

    this.catalogLoaded = true;
    this.currentCategory = this.catalog.getCategoryIds()[0];
  }
}
