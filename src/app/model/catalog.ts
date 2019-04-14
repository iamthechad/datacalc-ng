import {Category} from "./category";
import * as _ from "lodash";

export class Catalog {
  private readonly entries: { [key: string]: Category };

  get firstCategory(): Category {
    return this.getCategories()[0];
  }

  constructor(catalog: { [key: string]: Category}) {
    this.entries = catalog;
  }

  hasCategory(categoryId: string): boolean {
    return _.has(this.entries, categoryId);
  }

  getCategory(categoryId: string): Category {
    return this.entries[categoryId];
  }

  getCategories(): Category[] {
    return _.sortBy(_.values(this.entries), ["id"]);
  }
}
