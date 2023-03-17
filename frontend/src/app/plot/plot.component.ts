import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from '../data.service';
import { DatasetImage } from '../dataset-image';
import { PlotlyConfig, PlotlyData, PlotlyLayout } from '../plotly-graph';

@Component({
  selector: 'app-plot',
  templateUrl: './plot.component.html',
  styleUrls: ['./plot.component.css']
})
export class PlotComponent {
  @Input() datasetImage!: DatasetImage;
  showBoundingBoxes!: boolean;
  showSegmentations!: boolean;

  private showBboxSub!: Subscription;
  private showAnnotationSub!: Subscription;

  data: PlotlyData[] = [];
  layout: PlotlyLayout;
  config: PlotlyConfig;

  constructor(private dataService: DataService) {
    this.layout = {
      xaxis: {visible: false},
      yaxis: {visible: false, scaleanchor: "x"},
      images: [{
        x: 0,
        xref: "x",
        yref: "y",
        opacity: 1.0,
        layer: "below",
        sizing: "stretch"
      }],
      width: 1024,
      height: 768,
      margin: {l: 0, r: 0, t: 0, b: 0},
      showlegend: true,
      paper_bgcolor: "rgba(0, 0, 0, 0)",
      plot_bgcolor: "rgba(0, 0, 0, 0)"
    };

    this.config = {
      doubleClick: "autosize",
      displayModeBar: true
    }

    this.showBboxSub = this.dataService.getDrawBboxObs().subscribe(
      value => {
        this.showBoundingBoxes = value;
        if (this.datasetImage) {
          this.setData();
        }
      }
    )

    this.showAnnotationSub = this.dataService.getDrawSegmentationObs().subscribe(
      value => {
        this.showSegmentations = value;
        if (this.datasetImage) {
          this.setData();
        }
      }
    )
  }

  ngOnInit() {
    this.setData();
  }

  ngOnChanges() {
    this.setData();
  }

  ngOnDestory() {
    this.showBboxSub.unsubscribe();
    this.showAnnotationSub.unsubscribe();
  }

  setData() {
    this.layout.xaxis.range = [0, this.datasetImage.width];
    this.layout.yaxis.range = [0, this.datasetImage.height];

    // this.layout.width = this.datasetImage.width;
    // this.layout.height = this.datasetImage.height;

    this.layout.images[0].sizex = this.datasetImage.width;
    this.layout.images[0].y = this.datasetImage.height;
    this.layout.images[0].sizey = this.datasetImage.height;
    this.layout.images[0].source = `http://localhost:9000/api/datasets/${this.dataService.dataset}/images/${this.datasetImage!.name}/`;

    this.data = [];

    this.data.push({
      x: [0, this.datasetImage.width],
      y: [0, this.datasetImage.height],
      type: "scatter",
      mode: "markers",
      marker: { opacity: 0},
      showlegend: false
    });

    if (this.showBoundingBoxes) {
      this.datasetImage.annotations.forEach(annotation => {
        let y = this.datasetImage!.height - annotation.ytl;
        this.data.push({
          x: [annotation.xtl, annotation.xtl + annotation.width, annotation.xtl + annotation.width, annotation.xtl, annotation.xtl],
          y: [y, y, y - annotation.height, y - annotation.height, y],
          type: "scatter", 
          mode: "lines", 
          marker: {opacity: 1}, 
          name: annotation.category, 
          fill: "toself", 
          hoveron: "points",
          hoverinfo: "name"
        });
      });
    }

    if (this.showSegmentations) {
      this.datasetImage.annotations.forEach(annotation => {
        if (annotation.iscrowd === 0) {
          annotation.segmentation.forEach(segmentation => {
            const polygons: number[] = segmentation;
            const x: number[] = [];
            const y: number[] = [];
  
            for (let index = 0; index < polygons.length / 2; index++) {
              x.push(polygons[2 * index]);
              y.push(this.datasetImage.height - polygons[2 * index + 1]);
            }
      
            this.data.push({
              x: x,
              y: y,
              type: "scatter", 
              mode: "lines", 
              marker: {opacity: 1}, 
              name: annotation.category, 
              fill: "toself", 
              hoveron: "points",
              hoverinfo: "name"
            });
          });
        }
      })
    }
  }
}
