import { Component, OnInit, ViewChild } from '@angular/core';
import { take } from 'rxjs';
import { DataService } from '../data.service';
import { DatasetMetadata } from '../dataset-metadata';
import { DatasetService } from '../dataset.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  metadata: DatasetMetadata | null = null;
  datasetNames: string[] = [];
  filteredCategories: string[] = [];
  filterMode = "union";
  selectedDataset = ""

  constructor (private dataService: DataService, private datasetService: DatasetService) {}

  ngOnInit() {
    this.datasetService.getDatasetList().subscribe(names => this.datasetNames = names.datasets);
  }

  onDatasetChange() {
    this.dataService.setDataset(this.selectedDataset);
    this.dataService.setCategories([]);
    this.dataService.setFilterMode("union");
    this.dataService.setDrawBboxObs(false);
    this.dataService.setDrawSegmentationObs(false);

    if (this.selectedDataset) {
      this.datasetService.getDatasetMetadata(this.selectedDataset).subscribe(
        metadata => this.metadata = metadata
      );
    } else {
      this.metadata = null;
    }
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

  onDelete() {
    this.datasetService.deleteDataset(this.selectedDataset).subscribe(() => {
      this.datasetService.getDatasetList().subscribe(names => this.datasetNames = names.datasets);
      this.selectedDataset = "";
      this.onDatasetChange();
    });
  }
}
