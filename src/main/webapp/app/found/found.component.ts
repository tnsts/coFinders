import { Component, AfterViewChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ItemService } from 'app/entities/item/service/item.service';
import { IItem } from 'app/entities/item/item.model';
import * as dayjs from 'dayjs';

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

  constructor(private itemService: ItemService) {}

  ngAfterViewChecked(): void {
    if (this.map) {
      this.map.addMarker('found');
    }
  }

  save(map: any): void {
    const title = this.title;
    const description = this.description;
    const foundAt = this.date;
    const lat = map.marker.getLatLng().lat;
    const lon = map.marker.getLatLng().lng;
    let contacts = {};

    if (this.email) {
      contacts = Object.assign(contacts, { EMAIL: this.email });
    }
    if (this.phone) {
      contacts = Object.assign(contacts, { PHONE: this.phone });
    }
    if (this.telegram) {
      contacts = Object.assign(contacts, { TELEGRAM: this.telegram });
    }
    if (this.facebook) {
      contacts = Object.assign(contacts, { FACEBOOK: this.facebook });
    }

    this.itemService
      .create({
        title,
        description,
        foundAt: dayjs(foundAt),
        lat,
        lon,
        contacts,
      } as IItem)
      .subscribe(response => {
        console.log(response);
      });
  }
}
