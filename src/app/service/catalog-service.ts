import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Observable} from 'rxjs/Observable';
import {AngularFireDatabase} from 'angularfire2/database';
import {Category} from '../model/category';
import {Catalog} from '../model/catalog';
import {Item} from '../model/item';
import {Map} from 'immutable';

import * as _ from 'lodash';
import {recordify} from 'typed-immutable-record';
import {ItemRecord} from '../model/item-record';
import {CategoryRecord} from '../model/category-record';

@Injectable()
export class CatalogService {
  private catalogObservable: ReplaySubject<Catalog> = new ReplaySubject();
  private item: Observable<any[]>;

  constructor(ad: AngularFireDatabase) {
    this.item = ad.object('/catalog').valueChanges();
    this.item.subscribe(snapshot => this.buildCatalog(snapshot));
  }

  getCatalogObservable(): Observable<Catalog> {
    return this.catalogObservable.asObservable();
  }

  private buildCatalog(snapshot) {
    if (snapshot.categories && snapshot.items) {
      const categoryMap: { [key: string]: Category } = {};
      _.forEach(snapshot.categories, (snapshotCategory: Category, id) => {
        categoryMap[id] = recordify<Category, CategoryRecord>(Object.assign({items: {}, id}, snapshotCategory));
      });

      _.forEach(snapshot.items, (snapshotItem: Item, id) => {
        categoryMap[snapshotItem.category].items[id] = recordify<Item, ItemRecord>(Object.assign({id}, snapshotItem));
      });

      this.catalogObservable.next({ entries: Map(categoryMap) });
    }
  }
}
