import {Inject, Injectable} from "@angular/core";
import {ReplaySubject, Observable} from "rxjs";
import {Catalog} from "../model/catalog";
import {CatalogLoader, CatalogLoaderToken} from "../model/catalog-loader";

@Injectable()
export class CatalogService {
  private catalogObservable: ReplaySubject<Catalog> = new ReplaySubject(1);

  constructor(@Inject(CatalogLoaderToken) private catalogLoaderService: CatalogLoader) {
    this.catalogLoaderService.loadCatalog().subscribe(catalog => this.catalogObservable.next(catalog));
  }

  getCatalogObservable(): Observable<Catalog> {
    return this.catalogObservable.asObservable();
  }
}
