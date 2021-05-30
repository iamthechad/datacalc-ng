import { TestBed, waitForAsync } from "@angular/core/testing";

import {IconTranslateService, IconTranslateServiceToken} from "./icon-translate.service";
import {FontAwesomeIconTranslateService} from "./font-awesome-icon-translate.service";

describe("FontAwesomeIconTranslateService", () => {
  let translateService: IconTranslateService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [ { provide: IconTranslateServiceToken, useClass: FontAwesomeIconTranslateService } ]
    });
  }));

  beforeEach(() => {
    translateService = TestBed.get(IconTranslateServiceToken);
  });

  it("should be created", () => {
    expect(translateService).toBeTruthy();
  });

  it("should correctly map category icon types", () => {
    const iconMapping = [
      {
        category: "icon-coin-dollar",
        expectedIcon: "fa-dollar-sign"
      },
      {
        category: "icon-user",
        expectedIcon: "fa-user"
      },
      {
        category: "icon-library",
        expectedIcon: "fa-balance-scale"
      },
      {
        category: "icon-profile",
        expectedIcon: "fa-id-card"
      },
      {
        category: "icon-flag",
        expectedIcon: "fa-flag"
      },
      {
        category: "foo",
        expectedIcon: ""
      }
    ];
    iconMapping.forEach(mapping => {
      expect(mapping.expectedIcon).toEqual(translateService.translateIcon(mapping.category));
    });
  });
});
