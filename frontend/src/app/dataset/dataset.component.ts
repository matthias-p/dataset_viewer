import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from '../data.service';
import { DatasetImage } from '../dataset-image';
import { DatasetMetadata } from '../dataset-metadata';
import { DatasetService } from '../dataset.service';

@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.css']
})
export class DatasetComponent {
  private indexSub!: Subscription;

  datasetIndexes: number[] = []
  currentIndex = 0;
  datasetImage!: DatasetImage | null;

  constructor(private datasetService: DatasetService, private dataService: DataService) { }

  ngOnInit() {
    this.indexSub = this.dataService.getIndexObs().subscribe(
      indexes => this.onIndexesChange(indexes)
    )
  }

  ngOnDestroy() {
    this.indexSub.unsubscribe();
  }

  onIndexesChange(indexes: number[]) {
    this.currentIndex = 0;
    this.datasetIndexes = indexes;
    if (indexes.length) {
      this.getCurrentImage();
    } else {
      this.datasetImage = null;
    }
  }

  onNextClick() {
    if (this.currentIndex < this.datasetIndexes.length - 1) {
      ++this.currentIndex;
      this.getCurrentImage();
    }
  }

  onPrevClick() {
    if (this.currentIndex > 0) {
      --this.currentIndex;
      this.getCurrentImage();    
    }
  }

  getCurrentImage() {
    this.datasetService.getDatasetImage(this.dataService.dataset, this.datasetIndexes[this.currentIndex]).subscribe({
      next: image => {
        this.datasetImage = image;
      }
    });
  }
}
