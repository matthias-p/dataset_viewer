import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { DatasetStatistics } from '../dataset-statistics';
import { DatasetService } from '../dataset.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {
  statistics: DatasetStatistics | null = null;

  instanceSizeLayout = {
    title: "Normalized Instance Size",
    bargap: 0,
    xaxis: {
      title: "Instance size",
      range: [0, 1],
    },
    yaxis: {
      title: "Percentag of instances"
    },
  }

  instancesPerCategoryLayout = {
    title: "Instances Per Category",
    xaxis: {
      title: "Category",
      categoryorder: "total descending"
    },
    yaxis: {
      title: "Number of instances"
    },
  }

  categoriesPerImageLayout = {
    title: "Categories Per Image",
    xaxis: {
      title: "Number of categories"
    },
    yaxis: {
      title: "Number of images"
    },
  }

  instancesPerImageLayout = {
    title: "Instances Per Image",
    xaxis: {
      title: "Number of instances"
    },
    yaxis: {
      title: "Number of images"
    },
  }

  constructor(private dataService: DataService, private datasetService: DatasetService) {}

  ngOnInit() {
    this.dataService.getDatasetNameObs().subscribe(
      dsname => this.onDatasetChange(dsname)
    )
  }

  onDatasetChange(dsname: string) {
    if (dsname) {
      this.datasetService.getDatasetStatistics(dsname).subscribe(
        statistics => {
          this.statistics = statistics;
          console.log(this.statistics);
        }
      )
    } else {
      this.statistics = null;
    }
  }

  getInstanceSizeData() {
    return [{
      x: this.statistics?.instance_size.bins, y: this.statistics?.instance_size.values, type: "bar", offset: 0
    }]
  }

  getInstancesPerCategoryData() {
    const categories: string[] = []
    const values: number[] = []

    this.statistics?.instances_per_category.forEach(entry => {
      categories.push(entry.key);
      values.push(entry.value);
    });

    return [{
      x: categories, y: values, type: "bar",
    }]
  }

  getCategoriesPerImageData() {
    const categories: string[] = []
    const values: number[] = []

    this.statistics?.categories_per_image.forEach(entry => {
      categories.push(entry.key);
      values.push(entry.value);
    });

    return [{
      x: categories, y: values, type: "bar",
    }]
  }

  getInstancesPerImageData() {
    const categories: string[] = []
    const values: number[] = []

    this.statistics?.instances_per_image.forEach(entry => {
      categories.push(entry.key);
      values.push(entry.value);
    });

    return [{
      x: categories, y: values, type: "bar",
    }]
  }
}
