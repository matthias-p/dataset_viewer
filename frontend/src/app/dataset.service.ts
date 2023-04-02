import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { DatasetIndexes, DatasetMetadata, DatasetNames } from './dataset-metadata';
import { DatasetStatistics } from './dataset-statistics';
import { environment } from 'src/environments/environment';
import { NotificationService } from './notification.service';
import { AnnotationFile, Dataset, DatasetAnnotation, DatasetIds, DatasetImage } from './dataset';

@Injectable({
  providedIn: 'root'
})
export class DatasetService {

  constructor(private http: HttpClient, private notificationService: NotificationService) { }

  getDatasetList(): Observable<Dataset[]> {
    return this.http.get<Dataset[]>(environment.apiUrl).pipe(
      catchError(error => {
        this.notificationService.pushNotification(`${error.message}`, "danger");
        throw error;
      })
    );
  }

  getDatasetIds(datasetName: string, annotationFileNames: string[], categories: string[], filterMode: string = "union"): Observable<DatasetIds> {
    return this.http.get<DatasetIds>(`${environment.apiUrl}${datasetName}/`, { params: {ann: annotationFileNames, cat: categories, fm: filterMode}}).pipe(
      catchError(error => {
        this.notificationService.pushNotification(`${error.message}`, "danger");
        throw error;
      })
    );
  }

  // getDatasetIndexes(datasetName: string, category: string[] = [], filterMode = "union"): Observable<DatasetIndexes> {
  //   if (category.length) {
  //     return this.http.get<DatasetIndexes>(`${environment.apiUrl}${datasetName}/indexes/`, {params: { category: category, filterMode: filterMode}}).pipe(
  //       catchError(error => {
  //         this.notificationService.pushNotification(`${error.message}`, "danger");
  //         throw error;
  //       })
  //     );
  //   }
  //   return this.http.get<DatasetIndexes>(`${environment.apiUrl}${datasetName}/indexes/`).pipe(
  //     catchError(error => {
  //       this.notificationService.pushNotification(`${error.message}`, "danger");
  //       throw error;
  //     })
  //   );
  // }

  getDatasetImage(datasetName: string, imageName: string): Observable<DatasetImage> {
    return this.http.get<DatasetImage>(`${environment.apiUrl}${datasetName}/${imageName}/`).pipe(
      catchError(error => {
        this.notificationService.pushNotification(`${error.message}`, "danger");
        throw error;
      })
    );
  }

  getDatasetAnnotations(datasetName: string, imageName: string, annotationFiles: string[]): Observable<DatasetAnnotation[]> {
    return this.http.get<DatasetAnnotation[]>(`${environment.apiUrl}${datasetName}/${imageName}/annotations/`, {params: {"annotation_files": annotationFiles}}).pipe(
      catchError(error => {
        this.notificationService.pushNotification(`${error.message}`, "danger");
        throw error;
      })
    );
  }

  // getDatasetMetadata(datasetName: string): Observable<DatasetMetadata> {
  //   return this.http.get<DatasetMetadata>(`${environment.apiUrl}${datasetName}/metadata/`).pipe(
  //     catchError(error => {
  //       this.notificationService.pushNotification(`${error.message}`, "danger");
  //       throw error;
  //     })
  //   );
  // }

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



  // getDatasetImage(datasetName: string, index: number): Observable<DatasetImage> {
  //   return this.http.get<DatasetImage>(`${environment.apiUrl}${datasetName}/${index}/`).pipe(
  //     catchError(error => {
  //       this.notificationService.pushNotification(`${error.message}`, "danger");
  //       throw error;
  //     })
  //   );
  // }

  // deleteDataset(datasetName: string) {
  //   return this.http.delete(`${environment.apiUrl}${datasetName}/`, {responseType: "text"}).pipe(
  //     catchError(error => {
  //       this.notificationService.pushNotification(`${error.message}`, "danger");
  //       throw error;
  //     })
  //   );
  // }

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
