import { HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { DatasetService } from '../dataset.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  uploadProgress = 0

  constructor(private datasetService: DatasetService) {}

  onUploadClick(fileList: FileList | null) {
    if (fileList) {
      const file = fileList.item(0);
      if (file) {
        this.datasetService.uploadDataset(file).subscribe({
          next: event => {
            switch (event.type) {
              case HttpEventType.UploadProgress:
                if (event.total) {
                  this.uploadProgress = Math.round(event.loaded / event.total * 100);
                }
                else {
                  console.log(event.loaded);
                }
                break;
              case HttpEventType.Response:
                console.log(event.body);
                break;
            }
          },
          error: err => console.log(err)
        });
      }
    }
  }
}
