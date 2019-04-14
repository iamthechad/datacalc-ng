import {InjectionToken} from "@angular/core";

export const IconTranslateServiceToken = new InjectionToken<IconTranslateService>("IconTranslate");

export interface IconTranslateService {
  translateIcon(dataId: string): string;
}
