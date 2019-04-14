import { Pipe, PipeTransform } from "@angular/core";
import {Util} from "../common/util";

@Pipe({
  name: "price"
})
export class PricePipe implements PipeTransform {

  transform(value: number, args?: any): any {
    return Util.formatPrice(value);
  }

}
