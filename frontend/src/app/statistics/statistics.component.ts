import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from '../data.service';
import { DatasetStatistics } from '../dataset-statistics';
import { DatasetService } from '../dataset.service';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {
  statistics: DatasetStatistics | null = null;
  datasetName = "";
  filterMode = "";

  revision = 0;

  datasetNameSubscription!: Subscription;
  themeSubscription!: Subscription;

  instancesPerCategoryLayout = {
    title: "Instances Per Category",
    xaxis: {
      categoryorder: "total descending",
      tickangle: 45
    },
    yaxis: {
      title: "Number of instances"
    },
    paper_bgcolor: "rgba(0, 0, 0, 0)",
    plot_bgcolor: "rgba(0, 0, 0, 0)",

    font: {
      color: "#888"
    }
  }

  categoriesPerImageLayout = {
    title: "Categories Per Image",
    xaxis: {
      title: "Number of categories"
    },
    yaxis: {
      title: "Number of images"
    },
    paper_bgcolor: "rgba(0, 0, 0, 0)",
    plot_bgcolor: "rgba(0, 0, 0, 0)",

    font: {
      color: "#888"
    }
  }

  instancesPerImageLayout = {
    title: "Instances Per Image",
    xaxis: {
      title: "Number of instances"
    },
    yaxis: {
      title: "Number of images"
    },
    paper_bgcolor: "rgba(0, 0, 0, 0)",
    plot_bgcolor: "rgba(0, 0, 0, 0)",

    font: {
      color: "#888"
    }
  }

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
    paper_bgcolor: "rgba(0, 0, 0, 0)",
    plot_bgcolor: "rgba(0, 0, 0, 0)",

    font: {
      color: "#888"
    }
  }

  constructor(private dataService: DataService, private datasetService: DatasetService, private themeService: ThemeService) {}

  ngOnInit() {
    this.datasetNameSubscription = this.dataService.getDatasetNameObs().subscribe(
      dsname => this.onDatasetChange(dsname)
    );

    this.dataService.getCategoryObs().subscribe(
      categories => this.onCategoryChange(categories)
    );

    this.dataService.getFilterModeObs().subscribe(
      filterMode => {
        this.filterMode = filterMode;
        console.log(this.filterMode);
      }
    )

    this.themeSubscription = this.themeService.getThemeObs().subscribe(
      theme => this.onThemeChange(theme)
    )
  }

  ngOnDestroy() {
    this.datasetNameSubscription.unsubscribe();
    this.themeSubscription.unsubscribe();
  }

  onDatasetChange(dsname: string) {
    if (dsname) {
      this.datasetService.getDatasetStatistics(dsname).subscribe(
        statistics => {
          this.statistics = statistics;
        }
      )
    } else {
      this.statistics = null;
    }
  }

  onCategoryChange(categories: string[]) {
    this.datasetService.getDatasetStatistics(this.dataService.dataset, categories, this.filterMode).subscribe(
      statistics => {
        this.statistics = statistics;
        this.revision++;
      }
    )
  }

  onThemeChange(theme: string) {
    console.log(theme);
    if (theme === "dark") {
      this.instancesPerCategoryLayout.font.color = "#FFF"
      this.categoriesPerImageLayout.font.color = "#FFF"
      this.instancesPerImageLayout.font.color = "#FFF"
      this.instanceSizeLayout.font.color = "#FFF"
    } else {
      this.instancesPerCategoryLayout.font.color = "#000"
      this.categoriesPerImageLayout.font.color = "#000"
      this.instancesPerImageLayout.font.color = "#000"
      this.instanceSizeLayout.font.color = "#000"
    }
    
    this.revision++;
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
