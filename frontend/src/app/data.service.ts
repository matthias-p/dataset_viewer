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
  private drawBboxObs$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private drawSegmentationObs$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
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

  setDataset(dsname: string) {
    this.dataset = dsname;
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

  setCategories(categories: string[]) {
    this.datasetService.getDatasetIndexes(this.dataset, categories).subscribe(
      indexes => this.indexObs$.next(indexes.indexes)
    )
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
