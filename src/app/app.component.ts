import { Component } from '@angular/core';
import {AngularFire, FirebaseObjectObservable} from "angularfire2";
import {Catalog} from "./model/catalog";
import {Category} from "./model/category";
import {Item} from "./model/item";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = "Data Calculator";

  item: FirebaseObjectObservable<any[]>;

  catalog: Catalog;

  catalogLoaded = false;

  constructor(af: AngularFire) {
    this.item = af.database.object('/catalog');
    this.item.subscribe(snapshot => this.buildCatalog(snapshot));
  }

  private buildCatalog(snapshot) {
    const categories = new Map<string, Category>();
    //console.log(snapshot);
    for (let categoryId in snapshot.categories) {
      const category: Category = {
        id: categoryId,
        name: snapshot.categories[categoryId].name,
        icon: snapshot.categories[categoryId].icon
      };
      categories.set(category.id, category);
    }

    const items: Item[] = [];
    for (let itemId in snapshot.items) {
      const itemRaw = snapshot.items[itemId];
      const item: Item = {
        id: itemId,
        categoryId: itemRaw.category,
        name: itemRaw.name,
        value: itemRaw.value,
        commercialSource: itemRaw.commercialSource,
        probableSource: itemRaw.probableSource
      };
      if (itemRaw.hasOwnProperty("description")) {
        item.description = [];
        itemRaw.description.forEach(line => item.description.push(line));
      }
      items.push(item);
    }

    this.catalog = {
      categories: categories,
      items: items
    };

    console.log('Catalog loaded');
    this.catalogLoaded = true;
    //console.log(this.catalog);
  }
}
