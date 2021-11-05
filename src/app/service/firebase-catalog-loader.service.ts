import {CatalogLoader} from "../model/catalog-loader";
import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "@angular/fire/database";
import {Observable, of} from "rxjs";
import {Catalog} from "../model/catalog";
import {Category} from "../model/category";
import * as _ from "lodash";
import {Item} from "../model/item";
import {flatMap} from "rxjs/operators";
/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
@Injectable()
export class FirebaseCatalogLoaderService implements CatalogLoader {

  constructor(private ad: AngularFireDatabase) {}

  loadCatalog(): Observable<Catalog> {
    const item: Observable<any> = this.ad.object("/catalog").valueChanges();
    return item.pipe(
      flatMap(snapshot => {
        if (snapshot.categories && snapshot.items) {
          const categoryMap: { [key: string]: Category } = {};
          _.forEach(snapshot.categories, (snapshotCategory: Category, id) => {
            categoryMap[id] = {...{items: {}, id}, ...snapshotCategory};
          });

          _.forEach(snapshot.items, (snapshotItem: Item, id) => {
            categoryMap[snapshotItem.category].items[id] = {...{id}, ...snapshotItem};
          });

          return of(new Catalog(categoryMap));
        }
        return of(new Catalog({}));
      })
    );
  }
}
