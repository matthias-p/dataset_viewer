import { Directive, ElementRef, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDragAndDrop]'
})
export class DragAndDropDirective {

  @Output() fileDropped = new EventEmitter<FileList>();

  @HostBinding("class") dragOver = "";

  constructor(private el: ElementRef) { }

  @HostListener("dragover", ["$event"]) onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.dragOver = "ring-blue-700 dark:ring-blue-600";
  }

  @HostListener("dragleave", ["$event"]) onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.dragOver = "";
  }

  @HostListener("drop", ["$event"]) onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.dragOver = "";

    const files: FileList | null | undefined = event.dataTransfer?.files;
    if (files) {
      this.fileDropped.emit(files);
    }
  }
}
