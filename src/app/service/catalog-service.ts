import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Observable} from 'rxjs/Observable';
import {AngularFireDatabase, FirebaseObjectObservable} from 'angularfire2/database';
import {Category} from '../model/category';
import {Item} from '../model/item';
import {Catalog} from '../model/catalog';

import * as _ from 'lodash';

@Injectable()
export class CatalogService {
  private catalogObservable: ReplaySubject<Catalog> = new ReplaySubject();
  private item: FirebaseObjectObservable<any[]>;

  constructor(ad: AngularFireDatabase) {
    this.item = ad.object('/catalog');
    this.item.subscribe(snapshot => this.buildCatalog(snapshot));
  }

  getCatalogObservable(): Observable<Catalog> {
    return this.catalogObservable.asObservable();
  }

  private buildCatalog(snapshot) {
    const categoryMap: { [key: string]: Category } = {};
    _.forEach(snapshot.categories, (snapshotCategory: Category, id) => {
      categoryMap[id] = _.merge({ items: {}, id }, snapshotCategory);
    });

    _.forEach(snapshot.items, (snapshotItem: Item, id) => {
      categoryMap[snapshotItem.category].items[id] = _.merge({id}, snapshotItem);
    });

    this.catalogObservable.next(new Catalog(categoryMap));
  }
}
