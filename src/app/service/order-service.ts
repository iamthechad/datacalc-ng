import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Observable} from 'rxjs/Observable';
import {fromJS, List, Map} from 'immutable';

@Injectable()
export class OrderService {
  private orderObservable: ReplaySubject<Map<string, List<string>>> = new ReplaySubject();

  constructor() {
    const localStorageRef = localStorage.getItem('order');
    let order: Map<string, List<string>>;
    if (localStorageRef) {
      order = fromJS(JSON.parse(localStorageRef));
    } else {
      order = Map();
    }
    this.orderObservable.next(order);
  }

  getOrderObservable(): Observable<Map<string, List<string>>> {
    return this.orderObservable.asObservable();
  }

  storeOrder(order: Map<string, List<string>>) {
    if (order.isEmpty()) {
      localStorage.removeItem('order');
    } else {
      localStorage.setItem('order', JSON.stringify(order.toJS()));
    }
  }
}
