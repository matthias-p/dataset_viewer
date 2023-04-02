import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from '../data.service';
import { DatasetService } from '../dataset.service';
import { AnnotationFile, DatasetAnnotation, DatasetImage } from '../dataset';

@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.css']
})
export class DatasetComponent implements OnInit, OnDestroy {
  datasetName = "";
  annotationFileNames: string[] = []
  categories: string[] = [];
  filterMode = "union";

  datasetIds: string[] = [];
  currentIndex = 1;
  selectedImage: DatasetImage | null = null;
  currentAnnotations: DatasetAnnotation[] = []

  datasetNameSubscription!: Subscription;
  annotationFilesSubscription!: Subscription;
  categoriesSubscription!: Subscription;
  filterModeSubscription!: Subscription;

  constructor(private datasetService: DatasetService, private dataService: DataService) { }

  ngOnInit() {
    this.datasetNameSubscription = this.dataService.getDatasetNameObs().subscribe(
      datasetName => {
        this.datasetName = datasetName;
        this.onChange();
      }
    )

    this.annotationFilesSubscription = this.dataService.getAnnotationFilesObs().subscribe(
      annotationFiles => {
        if (annotationFiles.length == 0 && this.annotationFileNames.length == 0) {
          return;
        }
        this.annotationFileNames = annotationFiles.slice();
        this.getCurrentAnnotations();
      }
    )

    this.categoriesSubscription = this.dataService.getCategoryObs().subscribe(
      categories => {
        if (categories.length == 0 && this.categories.length == 0) {
          return
        }
        this.categories = categories.slice();
        this.onChange();
        }
    )

    this.filterModeSubscription = this.dataService.getFilterModeObs().subscribe(
      filterMode => {
        if (filterMode === this.filterMode) {
          return
        }
        this.filterMode = filterMode;
        this.onChange();
      }
    )
  }

  ngOnDestroy() {
    this.datasetNameSubscription.unsubscribe();
    this.categoriesSubscription.unsubscribe();
    this.filterModeSubscription.unsubscribe();
    this.annotationFilesSubscription.unsubscribe();
  }

  onChange() {
    if(this.datasetName) {
      this.datasetService.getDatasetIds(this.datasetName, this.annotationFileNames, this.categories, this.filterMode).subscribe(
        ids => {
          this.currentIndex = 1;
          this.datasetIds = ids.ids
          if (this.datasetIds.length) {
            this.getCurrentImage();
            this.getCurrentAnnotations();
          }
        }
      )
    } else {
      this.selectedImage = null;
    }
  }

  onNextClick() {
    if (this.currentIndex < this.datasetIds.length) {
      ++this.currentIndex;
      this.getCurrentImage();
      this.getCurrentAnnotations();
    }
  }

  onPrevClick() {
    if (this.currentIndex > 1) {
      --this.currentIndex;
      this.getCurrentImage();
      this.getCurrentAnnotations();
    }
  }

  getCurrentImage() {
    this.datasetService.getDatasetImage(this.datasetName, this.datasetIds[this.currentIndex - 1]).subscribe(
      datasetImage => {
        this.selectedImage = datasetImage;
      }
    );
  }

  getCurrentAnnotations() {
    if (this.annotationFileNames.length != 0) {
      this.datasetService.getDatasetAnnotations(this.datasetName, this.datasetIds[this.currentIndex - 1], this.annotationFileNames).subscribe(
        datasetAnnotations => {
          this.currentAnnotations = datasetAnnotations;
        }
      )
    }
  }
}
