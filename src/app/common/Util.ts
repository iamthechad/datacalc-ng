export class Util {
  static formatPrice(cents: number): string {
    return '$' + ( (cents / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') );
  }
}
