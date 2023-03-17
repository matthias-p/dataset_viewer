import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatasetComponent } from './dataset/dataset.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { UploadComponent } from './upload/upload.component';

const routes: Routes = [
  {path: "", component: DatasetComponent},
  {path: "upload", component: UploadComponent},
  {path: "statistics", component: StatisticsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
