import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from '../data.service';
import { DatasetStatistics } from '../dataset-statistics';
import { DatasetService } from '../dataset.service';
import { ThemeService } from '../theme.service';

interface PlotLayout {
  title: string,
  bargap?: number,

  xaxis: {
    title?: string,
    categoryorder?: string,
    tickangle?: number,
    range?: number[]
  },

  yaxis: {
    title: string
  },

  paper_bgcolor: string,
  plot_bgcolor: string,

  font: {
    color: string,
  }
}

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit, OnDestroy {
  private layouts: PlotLayout[] = [];

  datasetName = "";
  categories: string[] = [];
  filterMode = "union";

  statistics: DatasetStatistics | null = null;
  revision = 0;

  datasetNameSubscription!: Subscription;
  categoriesSubscription!: Subscription;
  filterModeSubscription!: Subscription;
  themeSubscription!: Subscription;

  instancesPerCategoryLayout: PlotLayout = {
    title: "Instances Per Category",
    xaxis: {
      categoryorder: "total descending",
      tickangle: 45
    },
    yaxis: {
      title: "Number of instances"
    },
    paper_bgcolor: "rgba(255, 255, 255, 1)",
    plot_bgcolor: "rgba(255, 255, 255, 1)",

    font: {
      color: "#888"
    }
  }

  categoriesPerImageLayout: PlotLayout = {
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

  instancesPerImageLayout: PlotLayout = {
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

  instanceSizeLayout: PlotLayout = {
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

  bboxCentersLayout: PlotLayout = {
    title: "BboxCenters",
    xaxis: {
      title: "Image width in %"
    },
    yaxis: {
      title: "Image height in %"
    },
    paper_bgcolor: "rgba(0, 0, 0, 0)",
    plot_bgcolor: "rgba(0, 0, 0, 0)",

    font: {
      color: "#888"
    }
  }

  constructor(private dataService: DataService, private datasetService: DatasetService, private themeService: ThemeService) {
    this.layouts.push(this.instancesPerCategoryLayout);
    this.layouts.push(this.categoriesPerImageLayout);
    this.layouts.push(this.instancesPerImageLayout);
    this.layouts.push(this.instanceSizeLayout);
    this.layouts.push(this.bboxCentersLayout);
  }

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

    this.themeSubscription = this.themeService.getThemeObs().subscribe(
      theme => this.onThemeChange(theme)
    )
  }

  ngOnDestroy() {
    this.datasetNameSubscription.unsubscribe();
    this.categoriesSubscription.unsubscribe();
    this.filterModeSubscription.unsubscribe();
    this.themeSubscription.unsubscribe();
  }

  onChange() {
    if (this.datasetName) {
      this.datasetService.getDatasetStatistics(this.datasetName, this.categories, this.filterMode).subscribe(
        statistics => {
          this.statistics = statistics;
          this.revision++;
        }
      )
    } else {
      this.statistics = null;
    }
  }

  onThemeChange(theme: string) {
    if (theme === "dark") {
      this.layouts.forEach(layout => {
        layout.font.color = "#FFF";
        layout.plot_bgcolor = "rgba(0,0,0,0)";
        layout.paper_bgcolor = "rgba(0,0,0,0)";
      });
    } else {
      this.layouts.forEach(layout => {
        layout.font.color = "#000";
        layout.plot_bgcolor = "#FFF";
        layout.paper_bgcolor = "#FFF";
      });
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

  getBboxCentersData() {
    return [{
      z: this.statistics?.bbox_centers.z, type: "heatmap"
    }]
  }
}
