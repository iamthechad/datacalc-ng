import * as _ from "lodash";

export class Order {
  private entries: { [key: string]: Set<string> } = {};

  constructor(order?: { [key: string]: Set<string> }) {
    if (order) {
      this.entries = order;
    }
  }

  addItem(categoryId: string, itemId: string): void {
    const categoryItems = this.getItemsForCategory(categoryId);
    categoryItems.add(itemId);
    this.entries[categoryId] = categoryItems;
  }

  removeItem(categoryId: string, itemId: string): void {
    const categoryItems = this.getItemsForCategory(categoryId);
    if (categoryItems.has(itemId)) {
      categoryItems.delete(itemId);
      if (categoryItems.size === 0) {
        delete this.entries[categoryId];
      } else {
        this.entries[categoryId] = categoryItems;
      }
    }
  }

  getCategoryIds(): string[] {
    return _.keys(this.entries).sort();
  }

  getItemsForCategory(categoryId: string): Set<string> {
    return _.get(this.entries, categoryId, new Set<string>([]));
  }

  isEmpty(): boolean {
    return _.isEmpty(this.entries);
  }

  clear(): void {
    this.entries = {};
  }

  public static asJS(order: Order): string {
    return JSON.stringify(order.entries, (key, value) => {
      if (typeof value === "object" && value instanceof Set) {
        return Array.from(value);
      }
      return value;
    });
  }

  public static fromString(orderString: string): Order {
    return new Order(JSON.parse(orderString, (key, value) => {
      if (Array.isArray(value)) {
        return new Set(value);
      }
      return value;
    }));
  }
}
