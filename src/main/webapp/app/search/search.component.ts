import { Component, AfterViewChecked } from '@angular/core';
import { SearchService } from './search.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'jhi-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements AfterViewChecked {
  search: any = null;
  dateFrom: Date = new Date(0);
  dateTo: Date = new Date();
  radius: any = 0;

  map: any;
  markerName = 'lost';

  success = false;

  constructor(private searchService: SearchService) {}

  ngAfterViewChecked(): void {
    if (this.map) {
      this.map.addMarker('lost');
    }
  }

  getPoints(map: any): void {
    const data = this.search;
    const startDate = this.dateFrom;
    const endDate = this.dateTo;
    const distance = this.radius;
    const lat = map.marker.getLatLng().lat;
    const lon = map.marker.getLatLng().lng;

    // formatDate(dateTo, 'dd-MM-yyyy HH-mm-ss', 'en');

    this.searchService.get({ data, startDate, endDate, distance, lat, lon }).subscribe(response => {
      map.showPoints(response);
    });

    // map.showPoints([
    //   {
    //     id: 1,
    //     title: 'Supervisor Berkshire',
    //     description: 'azure',
    //     foundAt: '2021-05-29T07:35:40Z',
    //     lat: 92.0,
    //     lon: 50.0,
    //     imageSrc: null,
    //     contacts: {
    //       EMAIL: 'test@example.com',
    //       PHONE: '+12344568',
    //     },
    //   },
    //   {
    //     id: 2,
    //     title: 'SQL',
    //     description: 'haptic Bike',
    //     foundAt: '2021-05-28T21:18:56Z',
    //     lat: 35.0,
    //     lon: 63.0,
    //     imageSrc: null,
    //     contacts: {
    //       EMAIL: 'test@example.com',
    //       PHONE: '1234',
    //       INSTAGRAM: '@test',
    //     },
    //   },
    //   {
    //     id: 3,
    //     title: 'silver',
    //     description: 'Buckinghamshire Loan',
    //     foundAt: '2021-05-29T04:48:21Z',
    //     lat: 77.0,
    //     lon: 36.0,
    //     imageSrc: null,
    //     contacts: {
    //       FACEBOOK: 'https://www.facebook.com/test123',
    //     },
    //   },
    //   {
    //     id: 4,
    //     title: 'Bedfordshire',
    //     description: 'portal Sausages',
    //     foundAt: '2021-05-28T22:23:30Z',
    //     lat: 69.0,
    //     lon: 56.0,
    //     imageSrc: null,
    //     contacts: {
    //       PHONE: '+12344568',
    //     },
    //   },
    //   {
    //     id: 5,
    //     title: 'Delaware',
    //     description: 'Shirt',
    //     foundAt: '2021-05-29T00:34:27Z',
    //     lat: 21.0,
    //     lon: 13.0,
    //     imageSrc: null,
    //     contacts: {
    //       EMAIL: 'test@example.com',
    //       PHONE: '+12344568',
    //       FACEBOOK: 'https://www.facebook.com/test123',
    //     },
    //   },
    //   {
    //     id: 6,
    //     title: 'back backing',
    //     description: 'JBOD partnerships Spain',
    //     foundAt: '2021-05-29T12:12:53Z',
    //     lat: 35.0,
    //     lon: 33.0,
    //     imageSrc: null,
    //     contacts: {
    //       EMAIL: 'test@example.com',
    //       PHONE: '1234',
    //     },
    //   },
    // ]);
  }
}
