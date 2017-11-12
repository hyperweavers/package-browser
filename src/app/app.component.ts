import { Component, OnInit } from '@angular/core';

import { LoaderService } from './loader.service';

@Component({
  selector: 'package-browser',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})

export class AppComponent implements OnInit {
  showLoader: boolean;

  constructor(private loaderService: LoaderService) {}

  ngOnInit() {
    this.loaderService.status.subscribe((val: boolean) => {
      this.showLoader = val;
    });
  }
}
