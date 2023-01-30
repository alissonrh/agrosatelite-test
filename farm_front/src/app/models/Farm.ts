import { Owner } from './Owner'

export interface Farm {
  id?: string,
  name: string,
  geometry: any,
  area?: number,
  centroid?: number[],
  municipality?: string,
  state?: string,
  owner?: Owner | {}
  }