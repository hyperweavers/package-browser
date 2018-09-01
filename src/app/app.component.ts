import { Component, OnInit, HostListener } from '@angular/core';

import { LoaderService } from './providers/loader.service';

@Component({
  selector: 'app-package-browser',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  showLoader: boolean;
  showScrollToTop: boolean = false;

  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
    this.loaderService.status.subscribe((val: boolean) => {
      this.showLoader = val;
    });
  }

  scrollToTop() {
    const scrollTo = 0;
    const animationDuration = 500;

    if (window.pageYOffset !== 0) {
      const diff = scrollTo - window.pageYOffset;
      const scrollStep = Math.PI / (animationDuration / 10);
      let count = 0, currPos;

      const scrollInterval = setInterval(function () {
        if (window.pageYOffset !== scrollTo) {
          count = count + 1;
          currPos = window.pageYOffset + diff * (0.5 - 0.5 * Math.cos(count * scrollStep));
          window.scrollTo(0, currPos);
        } else {
          clearInterval(scrollInterval);
        }
      }, 10);
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (window.pageYOffset > 100) {
      this.showScrollToTop = true;
    } else {
      this.showScrollToTop = false;
    }

    return false;
  }
}
