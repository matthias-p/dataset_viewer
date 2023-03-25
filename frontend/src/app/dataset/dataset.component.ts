import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from '../data.service';
import { DatasetImage } from '../dataset-image';
import { DatasetService } from '../dataset.service';

@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.css']
})
export class DatasetComponent implements OnInit, OnDestroy {
  datasetName = "";
  categories: string[] = [];
  filterMode = "union";

  datasetIndexes: number[] = []
  currentIndex = 1;
  datasetImage!: DatasetImage | null;

  datasetNameSubscription!: Subscription;
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
  }

  onChange() {
    if(this.datasetName) {
      this.datasetService.getDatasetIndexes(this.datasetName, this.categories, this.filterMode).subscribe(
        indexes => {
          this.currentIndex = 1;
          this.datasetIndexes = indexes.indexes;
          if (this.datasetIndexes.length) {
            this.getCurrentImage();
          }
        }
      )
    } else {
      this.datasetImage = null;
    }
  }

  onNextClick() {
    if (this.currentIndex < this.datasetIndexes.length) {
      ++this.currentIndex;
      this.getCurrentImage();
    }
  }

  onPrevClick() {
    if (this.currentIndex > 1) {
      --this.currentIndex;
      this.getCurrentImage();    
    }
  }

  getCurrentImage() {
    this.datasetService.getDatasetImage(this.datasetName, this.datasetIndexes[this.currentIndex - 1]).subscribe({
      next: image => {
        this.datasetImage = image;
      }
    });
  }
}
