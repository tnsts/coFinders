export class Filters {
  constructor(
    public data: string,
    public startDate: Date,
    public endDate: Date,
    public distance: number,
    public lat: number,
    public lon: number
  ) {}
}
