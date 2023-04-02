import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { AnnotationFile } from './dataset';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private datasetNameObs$: ReplaySubject<string> = new ReplaySubject<string>(1);
  private annotationFilesObs$: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);
  private categoryObs$: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);
  private filerModeObs$: ReplaySubject<string> = new ReplaySubject<string>(1);
  private drawBboxObs$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private drawSegmentationObs$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  getDatasetNameObs(): Observable<string> {
    return this.datasetNameObs$.asObservable();
  }

  setDataset(dsname: string) {
    this.datasetNameObs$.next(dsname);
  }

  setAnnotationFiles(annotationFiles: AnnotationFile[]) {
    const annFileNames: string[] = [];
    annotationFiles.forEach(annotationFile => {
      annFileNames.push(annotationFile.name);
    })
    this.annotationFilesObs$.next(annFileNames);
  }

  getAnnotationFilesObs(): Observable<string[]> {
    return this.annotationFilesObs$.asObservable();
  }

  setCategories(categories: string[]) {
    this.categoryObs$.next(categories);
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
