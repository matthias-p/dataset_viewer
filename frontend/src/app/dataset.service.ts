import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatasetImage } from './dataset-image';
import { DatasetIndexes, DatasetMetadata, DatasetNames } from './dataset-metadata';
import { DatasetStatistics } from './dataset-statistics';

@Injectable({
  providedIn: 'root'
})
export class DatasetService {
  private url = "http://localhost:9000/api/datasets/";

  constructor(private http: HttpClient) { }

  getDatasetList(): Observable<DatasetNames> {
    return this.http.get<DatasetNames>(this.url);
  }

  getDatasetMetadata(datasetName: string): Observable<DatasetMetadata> {
    return this.http.get<DatasetMetadata>(`${this.url}${datasetName}/metadata/`);
  }

  getDatasetStatistics(datasetName: string): Observable<DatasetStatistics> {
    return this.http.get<DatasetStatistics>(`${this.url}${datasetName}/statistics/`);
  }

  getDatasetIndexes(datasetName: string, category: string[] = [], filterMode: string = "union"): Observable<DatasetIndexes> {
    if (category.length) {
      return this.http.get<DatasetIndexes>(`${this.url}${datasetName}/indexes/`, {params: { category: category, filterMode: filterMode}});
    }
    return this.http.get<DatasetIndexes>(`${this.url}${datasetName}/indexes/`);
  }

  getDatasetImage(datasetName: string, index: number): Observable<DatasetImage> {
    return this.http.get<DatasetImage>(`${this.url}${datasetName}/`, {params: {index: index}});
  }

  uploadDataset(file: File): Observable<HttpEvent<any>> {
    const formdata = new FormData();
    formdata.append("dataset", file);

    return this.http.post(`${this.url}upload/`, formdata, {reportProgress: true, observe: "events"});
  }
}
