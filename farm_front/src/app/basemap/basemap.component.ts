import { Component, ElementRef, Input, ViewChild, ViewEncapsulation } from '@angular/core'
import { MapAddon } from '@common/addon'
import _diff from 'lodash/difference'
import _omit from 'lodash/omit'
import _pick from 'lodash/pickBy'
import _values from 'lodash/values'
import { easeOut } from 'ol/easing.js'
import Layer from 'ol/layer'
import { Vector as VectorLayer } from 'ol/layer.js';
import Feature from 'ol/Feature';
import { Point } from 'ol/geom.js';
import { Vector as VectorSource } from 'ol/source.js';
import Tile from 'ol/layer/Tile'
import Map from 'ol/Map'
import XYZ from 'ol/source/XYZ'
import View from 'ol/View'
import { MapService } from '../map.service'

const DEFAULTS = {
  center: [0, 0] as [number, number],
  resolution: 4900,
  minZoom: 4,
  maxZoom: 17,
};

@Component({
  selector: 'app-basemap',
  template: `<div style="height: 100vh" #mapContainer></div>`,
  encapsulation: ViewEncapsulation.None,
})
export class BasemapComponent {
  @ViewChild('mapContainer') private $mapContainer!: ElementRef
  private _map!: Map
  private _initialLayers!: Layer[]
  private addons: Record<string, MapAddon | undefined> = {}
  @Input() fitoptions = {
    duration: 700,
    easing: easeOut,
    padding: [100, 100, 100, 400],
    maxZoom: 11,
  }

  ngOnInit() {
    this.getCurrentLocation();
  }

  getCurrentLocation() {
    let center = [] as unknown as [number, number]
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {  
        DEFAULTS.center = [position.coords.latitude, position.coords.longitude];
        console.log('center', DEFAULTS.center);
        this.mapInit();
      }); 
    } else {
      alert("Geolocation is not supported by this browser.");
      this.mapInit();
    }
    return center
  }

  constructor(private _mapService: MapService) { }

  mapInit() {    
    this._mapService.map = this;
    this._map = new Map({
      target: this.$mapContainer.nativeElement,
      layers: this.getInitialLayers().concat([
        new VectorLayer({
          source: new VectorSource({
            features: [
              new Feature({
                geometry: new Point(DEFAULTS.center),
              }),
            ],
          }),
        }),
      ]),
      loadTilesWhileAnimating: false,
      view: new View({
        center: DEFAULTS.center,
        resolution: DEFAULTS.resolution,
        minZoom: DEFAULTS.minZoom,
        maxZoom: DEFAULTS.maxZoom,
      }),
      controls: [],
    });
    (window as any).__map = this._map;
  }

  /* async ngAfterViewInit() {
    try {
      await this.mapInit()
    } catch { }
  } */

  public setAddons(
    addons: Record<string, MapAddon | undefined>,
    force = false,
    mountOnInclude: boolean = true
  ) {
    const keep = force
      ? {}
      : _pick(this.addons, (_v, key) => {
        if (key.startsWith('root::')) return true
        if (key.startsWith('base_layer::')) return true
        return false
      })
    const toSet = { ...keep, ...addons }
    this.__updateAddons(this.addons, toSet, mountOnInclude)
    this.addons = toSet
  }

  includeAddon(addon: MapAddon, mountOnInclude: boolean = true) {
    const identifier = addon.identifier
    this.setAddons(
      {
        ...this.getAddons(),
        [identifier]: addon,
      },
      false,
      mountOnInclude
    )
  }

  removeAddon(force: boolean, ...keys: string[]): void
  removeAddon(...keys: string[]): void
  removeAddon(...args: any[]) {
    if (args[0] === true) {
      const keys = args.slice(1)
      this.setAddons(_omit(this.getAddons(), keys), true)
    } else {
      const keys = args
      this.setAddons(_omit(this.getAddons(), keys))
    }
  }

  removeByPrefix(prefix: string) {
    const keys = Object.keys(this.getAddons())
    const toRemove = keys.filter((key) => key.startsWith(prefix))
    this.removeAddon(...toRemove)
  }

  private async __updateAddons(
    prevAddons: Record<string, MapAddon | undefined>,
    currAddons: Record<string, MapAddon | undefined>,
    mountOnInclude: boolean = true
  ) {
    if (!this._map) {
      return
    }
    const prevList = _values(prevAddons).filter((x) => x)
    const currList = _values(currAddons).filter((x) => x)
    const toRemove = _diff(prevList, currList).filter((x) => x)
    const toAdd = _diff(currList, prevList).filter((x) => x)
    await Promise.all(
      toRemove.map(async (a) => {
        await a!.waitRemout
        a!.unmount(this._map)
      })
    )
    for (let x = 0; x < toAdd.length; x++) {
      const addon = toAdd[x]!
      addon._hasInit = addon.asyncInit()
      await addon._hasInit
      if (mountOnInclude && this._map) addon.mount(this._map)
    }
  }

  public getAddons() {
    return this.addons
  }

  public getAddon(name: string) {
    return this.addons[name]
  }

  getMap(): Map {
    return this._map
  }

  fitToAddons(addonKeys: string[], fitOptions?) {
    let baseExtent = null as any
    this.fitoptions.maxZoom = 15
    for (let x = 0; x < addonKeys.length; x++) {
      const addonKey = addonKeys[x]
      const addon = this.getAddons()[addonKey]
      if (addon && addon.getExtent) {
        const current = addon.getExtent()
        if (!baseExtent) baseExtent = current
        else {
          baseExtent = [
            Math.min(baseExtent[0], current[0]),
            Math.min(baseExtent[1], current[1]),
            Math.max(baseExtent[2], current[2]),
            Math.max(baseExtent[3], current[3]),
          ]
        }
      }
    }
    if (baseExtent) {
      this._map.getView().fit(baseExtent, fitOptions || this.fitoptions)
    }
  }

  public listByPrefix(prefix: string) {
    return Object.keys(this.addons).filter((x) => x.startsWith(prefix))
  }

  private getInitialLayers(): Layer[] {
    const rasterLayer = new Tile({
      source: new XYZ({
        url: 'https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}&apistyle=s.t%3A1%7Cp.v%3Aon%2Cs.t%3A21%7Cs.e%3Al%7Cp.v%3Aoff%2Cs.t%3A2%7Cp.v%3Aoff%2Cs.t%3A2%7Cs.e%3Al.t%7Cp.v%3Aoff%2Cs.t%3A33%7Cp.v%3Aoff%2Cs.t%3A33%7Cs.e%3Al.i%7Cp.v%3Aoff%2Cs.t%3A3%7Cs.e%3Al.i%7Cp.v%3Aoff%2Cs.t%3A51%7Cs.e%3Al%7Cp.v%3Aoff%2Cs.t%3A4%7Cp.v%3Aoff',
        crossOrigin: 'Anonymous',
      }),
    })
    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [
          new Feature({
            geometry: new Point(DEFAULTS.center),
          }),
        ],
      }),
    });
    this._initialLayers = [rasterLayer, vectorLayer];
    return this._initialLayers
  }
}

/* Estou usando a API do OpenLayers. Gostaria de uma função que pegasse as coordenadas de localização do usuário do chrome e colocasse em DEFAULTS.center

const DEFAULTS = {
  center: [-6500000, -1700000] as [number, number],
  resolution: 4900,
  minZoom: 4,
  maxZoom: 17,
} */
