import { Component, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'jhi-found',
  templateUrl: './found.component.html',
  styleUrls: ['./found.component.scss'],
})
export class FoundComponent implements AfterViewChecked {
  title: any = '';
  description: any = '';
  date: Date = new Date();
  email: any = '';
  phone: any = '';
  telegram: any = '';
  facebook: any = '';

  map: any;
  markerName = 'found';
  // constructor() { }
  //
  ngAfterViewChecked(): void {
    if (this.map) {
      this.map.addMarker('found');
    }
  }
}
