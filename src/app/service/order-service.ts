import {Injectable} from "@angular/core";
import {ReplaySubject, Observable} from "rxjs";
import {Order} from "../model/order";

@Injectable()
export class OrderService {
  private readonly currentOrder: Order;
  private orderObservable: ReplaySubject<Order> = new ReplaySubject(1);

  constructor() {
    const localStorageRef = localStorage.getItem("order");
    if (localStorageRef) {
      this.currentOrder = Order.fromString(localStorageRef);
    } else {
      this.currentOrder = new Order();
    }
    this.orderObservable.next(this.currentOrder);
  }

  getOrderObservable(): Observable<Order> {
    return this.orderObservable.asObservable();
  }

  getCurrentOrder(): Order {
    return this.currentOrder;
  }

  addItem(itemId: string, categoryId: string): void {
    this.currentOrder.addItem(categoryId, itemId);
    this.storeOrder();
    this.orderObservable.next(this.currentOrder);
  }

  removeItem(itemId: string, categoryId: string): void {
    this.currentOrder.removeItem(categoryId, itemId);
    this.storeOrder();
    this.orderObservable.next(this.currentOrder);
  }

  getItemsForCategory(categoryId: string): Set<string> {
    return this.currentOrder.getItemsForCategory(categoryId);
  }

  clearOrder(): void {
    this.currentOrder.clear();
    this.storeOrder();
    this.orderObservable.next(this.currentOrder);
  }

  private storeOrder() {
    if (this.currentOrder.isEmpty()) {
      localStorage.removeItem("order");
    } else {
      localStorage.setItem("order", Order.asJS(this.currentOrder));
    }
  }
}
