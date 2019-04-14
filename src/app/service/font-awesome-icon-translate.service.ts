import {IconTranslateService} from "./icon-translate.service";
import {Injectable} from "@angular/core";

@Injectable()
export class FontAwesomeIconTranslateService implements IconTranslateService {
  translateIcon(dataId: string): string {
    switch (dataId) {
      case "icon-coin-dollar":
        return "fa-dollar-sign";
      case "icon-user":
        return "fa-user";
      case "icon-library":
        return "fa-balance-scale";
      case "icon-profile":
        return "fa-id-card";
      case "icon-flag":
        return "fa-flag";
      default:
        return "";
    }
  }
}
