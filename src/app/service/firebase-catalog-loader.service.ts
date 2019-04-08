import {CatalogLoader} from "../model/catalog-loader";
import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "@angular/fire/database";
import {Observable, of} from "rxjs";
import {Catalog} from "../model/catalog";
import {Category} from "../model/category";
import * as _ from "lodash";
import {recordify} from "typed-immutable-record";
import {CategoryRecord} from "../model/category-record";
import {Item} from "../model/item";
import {ItemRecord} from "../model/item-record";
import {flatMap} from "rxjs/operators";
import {Map} from "immutable";

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
            categoryMap[id] = recordify<Category, CategoryRecord>(Object.assign({items: {}, id}, snapshotCategory));
          });

          _.forEach(snapshot.items, (snapshotItem: Item, id) => {
            categoryMap[snapshotItem.category].items[id] = recordify<Item, ItemRecord>(Object.assign({id}, snapshotItem));
          });

          return of({ entries: Map(categoryMap) } as Catalog);
        }
        return of({ entries: Map() } as Catalog);
      })
    );
  }
}
