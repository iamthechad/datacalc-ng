import {Injectable} from "@angular/core";
import {ReplaySubject, Observable} from "rxjs";
import {Set, Map, fromJS, Iterable} from "immutable";
import isIndexed = Iterable.isIndexed;

@Injectable()
export class OrderService {
  private currentOrder: Map<string, Set<string>>;
  private orderObservable: ReplaySubject<Map<string, Set<string>>> = new ReplaySubject();

  constructor() {
    const localStorageRef = localStorage.getItem("order");
    if (localStorageRef) {
      this.currentOrder = fromJS(JSON.parse(localStorageRef),  (key, value) => isIndexed(value) ? value.toSet() : value.toOrderedMap());
    } else {
      this.currentOrder = Map();
    }
    this.orderObservable.next(this.currentOrder);
  }

  getOrderObservable(): Observable<Map<string, Set<string>>> {
    return this.orderObservable.asObservable();
  }

  getCurrentOrder(): Map<string, Set<string>> {
    return this.currentOrder;
  }

  addItem(itemId: string, categoryId: string): void {
    this.currentOrder = this.currentOrder.set(categoryId, this.currentOrder.get(categoryId, Set()).add(itemId));
    this.storeOrder();
    this.orderObservable.next(this.currentOrder);
  }

  removeItem(itemId: string, categoryId: string): void {
    let categoryItems = this.currentOrder.get(categoryId, Set());
    if (categoryItems.has(itemId)) {
      categoryItems = categoryItems.delete(itemId);
      if (categoryItems.isEmpty()) {
        this.currentOrder = this.currentOrder.delete(categoryId);
      } else {
        this.currentOrder = this.currentOrder.set(categoryId, categoryItems);
      }
    }
    this.storeOrder();
    this.orderObservable.next(this.currentOrder);
  }

  getItemsForCategory(categoryId: string): Set<string> {
    return this.currentOrder.get(categoryId, Set());
  }

  clearOrder(): void {
    this.currentOrder = Map();
    this.storeOrder();
    this.orderObservable.next(this.currentOrder);
  }

  private storeOrder() {
    if (this.currentOrder.isEmpty()) {
      localStorage.removeItem("order");
    } else {
      localStorage.setItem("order", JSON.stringify(this.currentOrder.toJS()));
    }
  }
}
