import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Observable} from 'rxjs/Observable';
import {Set, Map, fromJS, Iterable} from 'immutable';
import isIndexed = Iterable.isIndexed;

@Injectable()
export class OrderService {
  private orderObservable: ReplaySubject<Map<string, Set<string>>> = new ReplaySubject();

  constructor() {
    const localStorageRef = localStorage.getItem('order');
    let order: Map<string, Set<string>> = Map();
    if (localStorageRef) {
      order = fromJS(JSON.parse(localStorageRef),  (key, value) => isIndexed(value) ? value.toSet() : value.toOrderedMap());
    } else {
      order = Map();
    }
    this.orderObservable.next(order);
  }

  getOrderObservable(): Observable<Map<string, Set<string>>> {
    return this.orderObservable.asObservable();
  }

  storeOrder(order: Map<string, Set<string>>) {
    if (order.isEmpty()) {
      localStorage.removeItem('order');
    } else {
      localStorage.setItem('order', JSON.stringify(order.toJS()));
    }
  }
}
