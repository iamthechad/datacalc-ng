import {Catalog} from "./catalog";
import {Observable} from "rxjs";
import {InjectionToken} from "@angular/core";

export const CatalogLoaderToken = new InjectionToken<CatalogLoader>("CatalogLoader");

export interface CatalogLoader {
  loadCatalog(): Observable<Catalog>;
}
