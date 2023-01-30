import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Farm } from './../models/Farm'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class FarmService {
  private baseUrl = 'http://localhost:8000/api/v1/farms'

  constructor(private http: HttpClient) {}

  create(farm: Farm) {
    return this.http.post(this.baseUrl, farm)
  }

  read(id: number): Observable<Farm> {
    return this.http.get<Farm>(`${this.baseUrl}/${id}`)
  }

  list(): Observable<Farm[]> {
    return this.http.get<Farm[]>(this.baseUrl)
  }

  update(id: number, farm: Farm) {
    return this.http.put(`${this.baseUrl}/${id}`, farm)
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`)
  }
}
