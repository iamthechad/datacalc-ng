export interface Item {
  readonly id: string;
  readonly category: string;
  readonly name: string;
  readonly value: number;
  readonly probableSource?: string;
  readonly commercialSource: string;
  readonly description?: string[];
  readonly note?: string;
}
