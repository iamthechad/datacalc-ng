import {Util} from "./util";
import {Category} from "../model/category";
import {Item} from "../model/item";
import {Catalog} from "../model/catalog";
import {Order} from "../model/order";

describe("Util functions", () => {
  const item1: Item = {
    id: "item1",
    category: "category1",
    name: "Item 1",
    value: 100,
    commercialSource: ""
  };

  const item2: Item = {
    id: "item2",
    category: "category1",
    name: "Item 2",
    value: 200,
    commercialSource: ""
  };

  const item3: Item = {
    id: "item3",
    category: "category2",
    name: "Item 3",
    value: 300,
    commercialSource: ""
  };

  const item4: Item = {
    id: "item4",
    category: "category2",
    name: "Item 4",
    value: 400,
    commercialSource: ""
  };

  const category1: Category = {
    id: "category1",
    name: "category 1",
    icon: "icon1",
    items: { item1, item2 }
  };

  const category2: Category = {
    id: "category2",
    name: "category 2",
    icon: "icon2",
    items: { item3, item4 }
  };

  const catalog = new Catalog({
      category1,
      category2
  });

  const order = new Order({
    category1: new Set(["item1"])
  });

  const multiOrder = new Order({
    category1: new Set(["item1"]),
    category2: new Set(["item3", "item4"])
  });

  const invalidOrder = new Order({
    categoryNone: new Set(["item1"]),
    category2: new Set(["item1"])
  });

  it("should format price", () => {
    expect(Util.formatPrice(0)).toEqual("$0.00");
    expect(Util.formatPrice(1)).toEqual("$0.01");
    expect(Util.formatPrice(100)).toEqual("$1.00");
    expect(Util.formatPrice(1000)).toEqual("$10.00");
    expect(Util.formatPrice(100000)).toEqual("$1,000.00");
  });

  it("should get items for a category", () => {
    expect(Util.getItemsForCategory(catalog, "category1")).toEqual([item1, item2]);
    expect(Util.getItemsForCategory(catalog, "category2")).toEqual([item3, item4]);
    expect(Util.getItemsForCategory(catalog, "categoryNot")).toEqual([]);
    expect(Util.getItemsForCategory(null, "category1")).toEqual([]);
    expect(Util.getItemsForCategory(null, null)).toEqual([]);
  });

  it("should get categories for an order", () => {
    expect(Util.getCategoriesForOrder(order, catalog)).toEqual([category1]);
    expect(Util.getCategoriesForOrder(multiOrder, catalog)).toEqual([category1, category2]);
    expect(Util.getCategoriesForOrder(order, null)).toEqual([]);
    expect(Util.getCategoriesForOrder(invalidOrder, catalog)).toEqual([category2]);
    expect(Util.getCategoriesForOrder(null, catalog)).toEqual([]);
    expect(Util.getCategoriesForOrder(null, null)).toEqual([]);
  });

  it("should get catalog items in an order", () => {
    expect(Util.getOrderCategoryItems(order, catalog, "category1")).toEqual([item1]);
    expect(Util.getOrderCategoryItems(order, catalog, "category2")).toEqual([]);
    expect(Util.getOrderCategoryItems(multiOrder, catalog, "category2")).toEqual([item3, item4]);
    expect(Util.getOrderCategoryItems(order, catalog, "categoryNone")).toEqual([]);
    expect(Util.getOrderCategoryItems(invalidOrder, catalog, "category1")).toEqual([]);
    expect(Util.getOrderCategoryItems(invalidOrder, catalog, "categoryNone")).toEqual([]);
    expect(Util.getOrderCategoryItems(null, catalog, "category1")).toEqual([]);
    expect(Util.getOrderCategoryItems(order, null, "category1")).toEqual([]);
    expect(Util.getOrderCategoryItems(order, catalog, null)).toEqual([]);
    expect(Util.getOrderCategoryItems(null, null, "category1")).toEqual([]);
    expect(Util.getOrderCategoryItems(order, null, null)).toEqual([]);
    expect(Util.getOrderCategoryItems(null, catalog, null)).toEqual([]);
    expect(Util.getOrderCategoryItems(null, null, null)).toEqual([]);
  });

  it("should build order total", () => {
    expect(Util.getOrderTotal(order, catalog)).toEqual(100);
    expect(Util.getOrderTotal(multiOrder, catalog)).toEqual(800);
    expect(Util.getOrderTotal(null, catalog)).toEqual(0);
    expect(Util.getOrderTotal(order, null)).toEqual(0);
    expect(Util.getOrderTotal(null, null)).toEqual(0);
  });
});
