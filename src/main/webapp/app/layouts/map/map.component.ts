import { Component, AfterViewInit, Input } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'jhi-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  map: any;
  marker: any;
  circle: any;
  radius: any;
  features: any;

  @Input() markerName = '';

  LAT: any = 50.44331254792026;
  LON: any = 30.524002959283134;
  ZOOM: any = 14;
  // constructor() { }

  initMap(): void {
    this.map = L.map('map', {
      center: [this.LAT, this.LON],
      zoom: this.ZOOM,
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });

    tiles.addTo(this.map);
    this.features = L.featureGroup().addTo(this.map);

    this.addMarker();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  addMarker(): void {
    this.marker = L.marker([this.LAT, this.LON], {
      icon: L.icon({
        iconUrl: `../../../content/images/${this.markerName}.png`,
        iconSize: [48, 48],
        iconAnchor: [24, 48],
      }),
      draggable: true,
    }).addTo(this.map);

    this.marker.on(
      'drag',
      () => {
        this.radiusChange(this.radius || 0);
      },
      this
    );

    this.locate();
  }

  locate(): void {
    this.map.locate();
    this.map.on(
      'locationfound',
      (e: any) => {
        if (e?.latlng) {
          this.map.setView(e.latlng, 18);
          this.marker.setLatLng(e.latlng);
          this.map.off('locationfound');
          this.radiusChange(this.radius || 0);
        }
      },
      this
    );
  }

  radiusChange(radius: any): void {
    if (!radius) {
      return;
    }

    if (!this.circle) {
      this.circle = L.circle(this.marker.getLatLng(), radius, {
        color: '#ffcc00',
        fillColor: '#ffcc00',
      }).addTo(this.map);
    } else {
      this.circle.setLatLng(this.marker.getLatLng()).setRadius(radius);
    }

    this.radius = radius;
  }

  showPoints(points: any): void {
    this.features.clearLayers();

    for (const point of points) {
      const marker = L.marker([point.lat, point.lon], {
        icon: L.icon({
          iconUrl: `../../../content/images/found.png`,
          iconSize: [48, 48],
          iconAnchor: [24, 48],
          popupAnchor: [0, -48],
        }),
        draggable: true,
      }).addTo(this.features);

      this.map.fitBounds(this.features.getBounds());

      const title = point.title as string;
      const description = point.description as string;

      let popup = `<h6><b>${title}</b></h6><p>${description}</p>`;
      for (let type in point.contacts) {
        if ({}.hasOwnProperty.call(point.contacts, type)) {
          const contact = point.contacts[type] as string;

          type = type.toLowerCase();
          popup += `<p>${type}: ${contact}</p>`;
        }
      }

      marker.bindPopup(popup);
    }
  }
}
