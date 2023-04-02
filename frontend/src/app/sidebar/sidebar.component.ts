import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { DatasetService } from '../dataset.service';
import { NotificationService } from '../notification.service';
import { AnnotationFile, Dataset } from '../dataset';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  datasets: Dataset[] = [];
  // filteredCategories: string[] = [];
  filterMode = "union";
  selectedDataset: Dataset | null = null;
  selectedAnnotations: AnnotationFile[] = []

  categoryUnion: string[] = [];

  constructor (private dataService: DataService, private datasetService: DatasetService, private notificationService: NotificationService) {}

  ngOnInit() {
    this.datasetService.getDatasetList().subscribe(datasets => this.datasets = datasets)
  }

  onDatasetChange() {
    if (this.selectedDataset) {
      this.dataService.setDataset(this.selectedDataset.dataset);
      this.dataService.setAnnotationFiles([]);
      this.dataService.setCategories([]);
      this.dataService.setFilterMode("union");
      this.dataService.setDrawBboxObs(false);
      this.dataService.setDrawSegmentationObs(false);
    }
  }

  onAnnotationsFileChange() {
    this.dataService.setAnnotationFiles(this.selectedAnnotations);

    let allCategories: string[] = [];
    this.selectedAnnotations.forEach(annotation => {
      allCategories = allCategories.concat(annotation.categories);
    });
    
    this.categoryUnion = Array.from(new Set(allCategories));
  }

  toggleBbox(value: boolean) {
    this.dataService.setDrawBboxObs(value);
  }

  toggleAnnotation(value: boolean) {
    this.dataService.setDrawSegmentationObs(value);
  }

  onCategoryChange(categories: string[]) {
    this.dataService.setCategories(categories);
  }

  onFilterModeChange() {
    this.dataService.setFilterMode(this.filterMode);
  }

  annotationSelected(annotation: AnnotationFile) {
    return this.selectedAnnotations.includes(annotation);
  }

  onAnnotationClick(annotation: AnnotationFile) {
    if (this.annotationSelected(annotation)) {
      this.selectedAnnotations.splice(this.selectedAnnotations.indexOf(annotation), 1);
    } else {
      this.selectedAnnotations.push(annotation);
    }

    this.onAnnotationsFileChange();
  }

  // onDelete() {
  //   this.datasetService.deleteDataset(this.selectedDataset).subscribe(() => {
  //     // this.datasetService.getDatasetList().subscribe(names => this.datasetNames = names.datasets);
  //     this.notificationService.pushNotification(`Deleted dataset: ${this.selectedDataset}`, "success")
  //     this.selectedDataset = "";
  //     this.onDatasetChange();
  //   });
  // }
}
