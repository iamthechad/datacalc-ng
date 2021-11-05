import {DebugElement} from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import {By} from "@angular/platform-browser";

import {Catalog} from "../model/catalog";
import {CatalogComponent} from "./catalog.component";
import {CatalogLoaderToken} from "../model/catalog-loader";
import {TestCatalogLoaderService} from "../test/service/test-catalog-loader.service";
import {CatalogService} from "../service/catalog-service";
import {IconTranslateServiceToken} from "../service/icon-translate.service";
import {FontAwesomeIconTranslateService} from "../service/font-awesome-icon-translate.service";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
const verifyCategoryItems = (fixture: ComponentFixture<CatalogComponent>, catalog: Catalog) => {
  const categoryButtons = fixture.debugElement.queryAll(By.css(".catalog-entry"));
  expect(categoryButtons.length).toEqual(catalog.getCategories().length);
  categoryButtons.forEach((button: DebugElement, index) => {
    expect(button.nativeElement.textContent).toContain(`category ${index + 1}`);
  });
};

const verifySelectedCategory = (fixture: ComponentFixture<CatalogComponent>, expectedCategoryName: string) => {
  const selectedCategoryButton = fixture.debugElement.query(By.css(".selected"));
  expect(selectedCategoryButton).not.toBeNull();
  expect(selectedCategoryButton.nativeElement.textContent).toContain(expectedCategoryName);
};

const verifyAndGetUnselectedCategory = (fixture: ComponentFixture<CatalogComponent>, expectedCategoryName: string) => {
  const unSelectedCategoryButton = fixture.debugElement.query(By.css("button:not(.selected)"));
  expect(unSelectedCategoryButton).toBeTruthy();
  expect(unSelectedCategoryButton.nativeElement.textContent).toContain(expectedCategoryName);
  return unSelectedCategoryButton;
};

describe("CatalogComponent Unit", () => {
  let component: CatalogComponent;
  let fixture: ComponentFixture<CatalogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogComponent],
      imports: [
        MatCardModule,
        MatIconModule,
        MatListModule
      ],
      providers: [
        CatalogService,
        { provide: CatalogLoaderToken, useClass: TestCatalogLoaderService },
        { provide: IconTranslateServiceToken, useClass: FontAwesomeIconTranslateService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should set the catalog with initial selected category", () => {
    verifyCategoryItems(fixture, TestCatalogLoaderService.getTestCatalog());
    verifySelectedCategory(fixture, "category 1");
  });

  it("should set selected category", waitForAsync(() => {
    verifyCategoryItems(fixture, TestCatalogLoaderService.getTestCatalog());
    verifySelectedCategory(fixture, "category 1");
    const unSelectedCategoryButton = verifyAndGetUnselectedCategory(fixture, "category 2");
    unSelectedCategoryButton.triggerEventHandler("click", 0);
    fixture.detectChanges();
    verifySelectedCategory(fixture, "category 2");
  }));
});
