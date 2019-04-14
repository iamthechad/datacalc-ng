import {CatalogLoader} from "../../model/catalog-loader";
import {Catalog} from "../../model/catalog";
import {Observable, of} from "rxjs";

export class TestCatalogLoaderService implements CatalogLoader {
  loadCatalog(): Observable<Catalog> {
    return of(TestCatalogLoaderService.getTestCatalog());
  }

  public static getTestCatalog(): Catalog {
    return new Catalog({
      category2: {
          id: "category2",
          name: "category 2",
          icon: "category2",
          items: {
            item21: {
              id: "item21",
              category: "category2",
              name: "Item 21",
              commercialSource: "Item 21 Source",
              value: 1234
            },
            item22: {
              id: "item22",
              category: "category2",
              name: "Item 22",
              commercialSource: "Item 22 Source",
              value: 4567
            }
          }
        },
      category1: {
          id: "category1",
          name: "category 1",
          icon: "category1",
          items: {
            item11: {
              id: "item11",
              category: "category1",
              name: "Item 11",
              commercialSource: "Item 11 Source",
              value: 1234
            },
            item12: {
              id: "item12",
              category: "category1",
              name: "Item 12",
              commercialSource: "Item 12 Source",
              value: 4567
            }
          }
        }
    });
  }
}
