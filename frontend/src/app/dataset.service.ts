import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatasetImage } from './dataset-image';
import { DatasetIndexes, DatasetMetadata, DatasetNames } from './dataset-metadata';
import { DatasetStatistics } from './dataset-statistics';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatasetService {

  constructor(private http: HttpClient) { }

  getDatasetList(): Observable<DatasetNames> {
    return this.http.get<DatasetNames>(environment.apiUrl);
  }

  getDatasetMetadata(datasetName: string): Observable<DatasetMetadata> {
    return this.http.get<DatasetMetadata>(`${environment.apiUrl}${datasetName}/metadata/`);
  }

  getDatasetStatistics(datasetName: string, category: string[] = [], filterMode = "union"): Observable<DatasetStatistics> {
    if (category.length) {
      return this.http.get<DatasetStatistics>(`${environment.apiUrl}${datasetName}/statistics/`, {params: { category: category, filterMode: filterMode}});
    }
    return this.http.get<DatasetStatistics>(`${environment.apiUrl}${datasetName}/statistics/`);
  }

  getDatasetIndexes(datasetName: string, category: string[] = [], filterMode = "union"): Observable<DatasetIndexes> {
    if (category.length) {
      return this.http.get<DatasetIndexes>(`${environment.apiUrl}${datasetName}/indexes/`, {params: { category: category, filterMode: filterMode}});
    }
    return this.http.get<DatasetIndexes>(`${environment.apiUrl}${datasetName}/indexes/`);
  }

  getDatasetImage(datasetName: string, index: number): Observable<DatasetImage> {
    return this.http.get<DatasetImage>(`${environment.apiUrl}${datasetName}/`, {params: {index: index}});
  }

  uploadDataset(file: File): Observable<HttpEvent<any>> {
    const formdata = new FormData();
    formdata.append("dataset", file);

    return this.http.post(`${environment.apiUrl}upload/`, formdata, {reportProgress: true, observe: "events"});
  }
}
