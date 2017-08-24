import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Observable} from 'rxjs/Observable';
import {Order} from '../model/order';

@Injectable()
export class OrderService {
  private orderObservable: ReplaySubject<Order> = new ReplaySubject();

  private static storeOrder(order: Order) {
    /*if (order.isEmpty()) {
      localStorage.removeItem('order');
    } else {
      localStorage.setItem('order', JSON.stringify(order.getFullOrder()));
    }*/
  }

  constructor() {
    const localStorageRef = localStorage.getItem('order');
    let order: Order;
    if (localStorageRef) {
      order = new Order(JSON.parse(localStorageRef));
    } else {
      order = new Order();
    }
    order.getOrderModifiedObservable().subscribe((modifiedOrder: Order) => {
      OrderService.storeOrder(modifiedOrder);
      this.orderObservable.next(modifiedOrder);
    });
    this.orderObservable.next(order);
  }

  getOrderObservable(): Observable<Order> {
    return this.orderObservable.asObservable();
  }
}
