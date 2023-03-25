import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { DatasetImage } from './dataset-image';
import { DatasetIndexes, DatasetMetadata, DatasetNames } from './dataset-metadata';
import { DatasetStatistics } from './dataset-statistics';
import { environment } from 'src/environments/environment';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class DatasetService {

  constructor(private http: HttpClient, private notificationService: NotificationService) { }

  getDatasetList(): Observable<DatasetNames> {
    return this.http.get<DatasetNames>(environment.apiUrl).pipe(
      catchError(error => {
        this.notificationService.pushNotification(`${error.message}`, "danger");
        throw error;
      })
    );
  }

  getDatasetMetadata(datasetName: string): Observable<DatasetMetadata> {
    return this.http.get<DatasetMetadata>(`${environment.apiUrl}${datasetName}/metadata/`).pipe(
      catchError(error => {
        this.notificationService.pushNotification(`${error.message}`, "danger");
        throw error;
      })
    );
  }

  getDatasetStatistics(datasetName: string, category: string[] = [], filterMode = "union"): Observable<DatasetStatistics> {
    if (category.length) {
      return this.http.get<DatasetStatistics>(`${environment.apiUrl}${datasetName}/statistics/`, {params: { category: category, filterMode: filterMode}}).pipe(
        catchError(error => {
          this.notificationService.pushNotification(`${error.message}`, "danger");
          throw error;
        })
      );
    }
    return this.http.get<DatasetStatistics>(`${environment.apiUrl}${datasetName}/statistics/`).pipe(
      catchError(error => {
        this.notificationService.pushNotification(`${error.message}`, "danger");
        throw error;
      })
    );
  }

  getDatasetIndexes(datasetName: string, category: string[] = [], filterMode = "union"): Observable<DatasetIndexes> {
    if (category.length) {
      return this.http.get<DatasetIndexes>(`${environment.apiUrl}${datasetName}/indexes/`, {params: { category: category, filterMode: filterMode}}).pipe(
        catchError(error => {
          this.notificationService.pushNotification(`${error.message}`, "danger");
          throw error;
        })
      );
    }
    return this.http.get<DatasetIndexes>(`${environment.apiUrl}${datasetName}/indexes/`).pipe(
      catchError(error => {
        this.notificationService.pushNotification(`${error.message}`, "danger");
        throw error;
      })
    );
  }

  getDatasetImage(datasetName: string, index: number): Observable<DatasetImage> {
    return this.http.get<DatasetImage>(`${environment.apiUrl}${datasetName}/${index}/`).pipe(
      catchError(error => {
        this.notificationService.pushNotification(`${error.message}`, "danger");
        throw error;
      })
    );
  }

  deleteDataset(datasetName: string) {
    return this.http.delete(`${environment.apiUrl}${datasetName}/`, {responseType: "text"}).pipe(
      catchError(error => {
        this.notificationService.pushNotification(`${error.message}`, "danger");
        throw error;
      })
    );
  }

  uploadDataset(file: File): Observable<HttpEvent<any>> {
    const formdata = new FormData();
    formdata.append("dataset", file);

    return this.http.post(`${environment.apiUrl}upload/`, formdata, {reportProgress: true, observe: "events"}).pipe(
      catchError(error => {
        this.notificationService.pushNotification(`${error.message}`, "danger");
        throw error;
      })
    );
  }
}
