import * as _ from 'lodash';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Observable} from 'rxjs/Observable';
import {fromJS, Map} from 'immutable';

export class Order {
  private selection: Map<string, string[]>;

  private orderModifyObservable: ReplaySubject<Order> = new ReplaySubject();

  constructor(selection?: { [key: string]: string[] }) {
    if (selection) {
      this.selection = fromJS(selection);
    } else {
      this.selection = Map();
    }
  }

  getOrderModifiedObservable(): Observable<Order> {
    return this.orderModifyObservable.asObservable();
  }

  addItem(categoryId: string, itemId: string): void {
    const itemIds = _.get(this.selection, categoryId, []);
    itemIds.push(itemId);

    this.selection = this.selection.set(categoryId, itemIds);
    this.orderModifyObservable.next(this);
  }

  removeItem(categoryId: string, itemId: string): void {
    _.remove(_.get(this.selection, categoryId, []), id => id === itemId);
    this.orderModifyObservable.next(this);
  }

  getItemsForCategory(categoryId: string): string[] {
    return _.get(this.selection, categoryId, []);
  }

  getCategoriesWithItems(): string[] {
    return this.selection.keySeq().toArray();
  }

  getItemIdsForCategory(categoryId: string): string[] {
    return _.get(this.selection, categoryId, []);
  }

  getFullOrder(): { [key: string]: string[] } {
    return _.omitBy(_.cloneDeep(this.selection), _.isEmpty);
  }

  isEmpty(): boolean {
    return _.isEmpty(this.getNonEmpty());
  }

  private getNonEmpty(): { [key: string]: string[] } {
    return _.omitBy(this.selection, _.isEmpty);
  }
}
