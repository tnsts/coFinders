import * as dayjs from 'dayjs';

export interface IItem {
  id?: number;
  title?: string;
  description?: string | null;
  foundAt?: dayjs.Dayjs;
  lat?: number;
  lon?: number;
  imageSrc?: string | null;
  contacts?: any | {};
}

export class Item implements IItem {
  constructor(
    public id?: number,
    public title?: string,
    public description?: string | null,
    public foundAt?: dayjs.Dayjs,
    public lat?: number,
    public lon?: number,
    public imageSrc?: string | null,
    contacts?: any | {}
  ) {}
}

export function getItemIdentifier(item: IItem): number | undefined {
  return item.id;
}
