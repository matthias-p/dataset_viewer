import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { DatasetIndexes, DatasetMetadata } from './dataset-metadata';
import { DatasetService } from './dataset.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private metadataObs$: BehaviorSubject<DatasetMetadata | null> = new BehaviorSubject<DatasetMetadata | null>(null);
  private indexObs$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  private categoryObs$: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);
  private filerModeObs$: BehaviorSubject<string> = new BehaviorSubject<string>("union");
  private drawBboxObs$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private drawSegmentationObs$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private datasetNameObs$: ReplaySubject<string> = new ReplaySubject<string>(1);
  dataset = "";

  constructor(private datasetService: DatasetService) { }

  getMetadataObs(): Observable<DatasetMetadata | null> {
    return this.metadataObs$.asObservable();
  }

  setMetadataObs(md: DatasetMetadata | null) {
    this.metadataObs$.next(md);
  }

  getIndexObs(): Observable<number[]> {
    return this.indexObs$.asObservable();
  }

  getDatasetNameObs(): Observable<string> {
    return this.datasetNameObs$.asObservable();
  }

  setDataset(dsname: string) {
    this.dataset = dsname;
    this.datasetNameObs$.next(dsname);
    if (dsname) {
      
      this.datasetService.getDatasetMetadata(dsname).subscribe(
        metadata => this.setMetadataObs(metadata)
      );

      this.datasetService.getDatasetIndexes(dsname).subscribe(
        indexes => this.indexObs$.next(indexes.indexes)
      );
    } else {
      this.setMetadataObs(null);
      this.indexObs$.next([]);
    }
  }

  setCategories(categories: string[], filterMode: string) {
    this.categoryObs$.next(categories);
    this.filerModeObs$.next(filterMode);
    this.datasetService.getDatasetIndexes(this.dataset, categories, filterMode).subscribe(
      indexes => this.indexObs$.next(indexes.indexes)
    )
  }

  getCategoryObs(): Observable<string[]> {
    return this.categoryObs$.asObservable();
  }

  setFilterMode(mode: string) {
    this.filerModeObs$.next(mode);
  }

  getFilterModeObs(): Observable<string> {
    return this.filerModeObs$.asObservable();
  }

  getDrawBboxObs(): Observable<boolean> {
    return this.drawBboxObs$.asObservable();
  }

  setDrawBboxObs(value: boolean) {
    this.drawBboxObs$.next(value);
  }

  getDrawSegmentationObs(): Observable<boolean> {
    return this.drawSegmentationObs$.asObservable();
  }

  setDrawSegmentationObs(value: boolean) {
    this.drawSegmentationObs$.next(value);
  }
}
