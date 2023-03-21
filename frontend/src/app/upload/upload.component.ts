import { HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { DatasetService } from '../dataset.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  uploadProgress = 0;
  file: File | null = null;

  constructor(private datasetService: DatasetService) {}

  onUploadClick(event: MouseEvent) {
    event.stopPropagation();

    if (this.file) {
      this.datasetService.uploadDataset(this.file).subscribe({
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

  onFilesChange(files: FileList | null) {
    if (files) {
      this.file = files.item(0);
    }
  }
}
