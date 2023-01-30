import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Farm } from '../models/Farm';
import { FarmService } from '../services/farm.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})

export class DetailsComponent implements OnInit {
  farm: Farm = {
    name: '',
    geometry: undefined,
    area: 0,
    centroid: [],
    owner: {},
    municipality: '',
    state: ''
  }

  constructor(
    private route: ActivatedRoute,
    private farmService: FarmService,
    private router: Router
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');    
    this.farmService.read(Number(id)).subscribe(
      farm => {
        console.log(farm);
        this.farm = farm;
      },
      error => {
        if (error.status === 404) {
          this.router.navigate(['/']);
        }
      }
    );
  }

  edit(id: number) {
    this.router.navigate(['farm', id]);
  }

  delete() {
    this.farmService.delete(Number(this.farm.id)).subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}