import { Component } from '@angular/core';
import { Farm } from '../models/Farm';
import { FarmService } from '../services/farm.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent {
  farms: Farm[] = [];

  constructor(private farmService: FarmService, private router: Router) {
    this.farmService.list().subscribe(farms => {
      this.farms = farms;
    });
  }

  goToDetails(id: number) {
    this.router.navigate(['/details', id]).catch(() => {
      this.router.navigate(['/']);
    });
  }
}



