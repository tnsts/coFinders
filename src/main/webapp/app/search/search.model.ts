export class Filters {
  constructor(
    public search: string,
    public dateFrom: Date,
    public dateTo: Date,
    public radius: number,
    public lat: number,
    public lon: number
  ) {}
}
