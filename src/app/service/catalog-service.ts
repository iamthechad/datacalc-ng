import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Observable} from 'rxjs/Observable';
import {AngularFireDatabase, FirebaseObjectObservable} from 'angularfire2/database';
import {Category} from '../model/category';
import {Item} from '../model/item';
import {Map} from 'immutable';

import * as _ from 'lodash';

@Injectable()
export class CatalogService {
  private catalogObservable: ReplaySubject<Map<string, Category>> = new ReplaySubject();
  private item: FirebaseObjectObservable<any[]>;

  constructor(ad: AngularFireDatabase) {
    this.item = ad.object('/catalog');
    this.item.subscribe(snapshot => this.buildCatalog(snapshot));
  }

  getCatalogObservable(): Observable<Map<string, Category>> {
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

    this.catalogObservable.next(Map(categoryMap));
  }
}
