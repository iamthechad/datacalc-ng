import {Order} from "./order";

describe("Order functions", () => {
  const orderObject = new Order({
    category1: new Set(["item11", "item12"]),
    category2: new Set(["item21", "item22"])
  });
  const orderString = `{"category1":["item11","item12"],"category2":["item21","item22"]}`;

  it("should create empty order", () => {
    const order = new Order({});
    expect(order.isEmpty()).toBeTruthy();
  });

  it("should parse to a string", () => {
    const convertedString = Order.asJS(orderObject);
    expect(convertedString).toEqual(orderString);

    const parsedOrder = Order.fromString(orderString);
    expect(parsedOrder).toEqual(orderObject);
  });
});
