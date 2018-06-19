import { Pipe, PipeTransform } from "@angular/core";
import {Util} from "./common/Util";

@Pipe({
  name: "price"
})
export class PricePipe implements PipeTransform {

  transform(value: number, args?: any): any {
    return Util.formatPrice(value);
  }

}
