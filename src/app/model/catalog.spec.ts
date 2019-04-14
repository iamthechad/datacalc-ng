import {Catalog} from "./catalog";
import {TestCatalogLoaderService} from "../test/service/test-catalog-loader.service";

describe("Catalog", () => {
  it("should create empty catalog", () => {
    const catalog = new Catalog({});
    expect(catalog.getCategories().length).toEqual(0);
    expect(catalog.firstCategory).toBeFalsy();
  });

  it("should create test catalog", () => {
    const catalog = TestCatalogLoaderService.getTestCatalog();
    expect(catalog.getCategories().length).toEqual(2);

    const firstCategory = catalog.firstCategory;
    expect(firstCategory).toBeTruthy();
    expect(firstCategory.id).toEqual("category1");
  });
});
