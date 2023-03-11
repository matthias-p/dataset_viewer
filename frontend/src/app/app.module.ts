import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DatasetComponent } from './dataset/dataset.component';
import { FormsModule } from '@angular/forms';
import { MultiselectComponent } from './multiselect/multiselect.component';
import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import { PlotComponent } from './plot/plot.component';
import { UploadComponent } from './upload/upload.component';
import { SidebarComponent } from './sidebar/sidebar.component';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
    DatasetComponent,
    MultiselectComponent,
    PlotComponent,
    UploadComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    PlotlyModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }