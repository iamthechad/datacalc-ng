export interface Item {
  id: string;
  category: string;
  name: string;
  value: number;
  probableSource?: string;
  commercialSource: string;
  description?: string[];
  note?: string;
}
