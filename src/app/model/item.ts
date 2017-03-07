export interface Item {
  id: string;
  categoryId: string;
  name: string;
  value: number;
  probableSource?: string;
  commercialSource: string;
  description?: string[];
}
