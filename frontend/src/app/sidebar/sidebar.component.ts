import { Component } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DataService } from '../data.service';
import { DatasetMetadata } from '../dataset-metadata';
import { DatasetService } from '../dataset.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  private metadataSub!: Subscription;
  private indexesSub!: Subscription;

  metadata: DatasetMetadata | null = null;
  datasetNames: string[] = [];
  filteredCategories: string[] = [];
  currentNumberOfIndexes = 0;
  filterMode: string = "union";

  constructor (private dataService: DataService, private datasetService: DatasetService) {}

  ngOnInit() {
    this.datasetService.getDatasetList().subscribe(names => this.datasetNames = names.datasets);
    this.metadataSub = this.dataService.getMetadataObs().subscribe(metadata => this.metadata = metadata);
    this.indexesSub = this.dataService.getIndexObs().subscribe(indexes => this.currentNumberOfIndexes = indexes.length);
  }

  ngOnDestroy() {
    this.metadataSub.unsubscribe();
    this.indexesSub.unsubscribe();
  }

  onDatasetChange(name: string) {
    this.dataService.setDataset(name);
  }

  toggleBbox(value: boolean) {
    this.dataService.setDrawBboxObs(value);
  }

  toggleAnnotation(value: boolean) {
    this.dataService.setDrawSegmentationObs(value);
  }

  onCategoryChange(categories: string[]) {
    this.filteredCategories = categories;
    this.updateIndexes();
  }

  onFilterModeChange() {
    this.dataService.setFilterMode(this.filterMode);
    this.updateIndexes();
  }

  updateIndexes() {
    this.dataService.setCategories(this.filteredCategories, this.filterMode);
  }
}
