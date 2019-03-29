import { DatacalcNgPage } from "./app.po";

describe("datacalc-ng App", () => {
  let page: DatacalcNgPage;

  beforeEach(() => {
    page = new DatacalcNgPage();
  });

  it("should display message saying app works", () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual("app works!");
  });
});
