import { Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { FILE_TYPES } from '../constants/constants';

@Directive({
  selector: '[appUpload]'
})
export class UploadDirective {
  @Output() onFileDropped = new EventEmitter<any>();
  @Input() disableOverlay = false;
  @HostBinding('class.drop-overlay') visible = false;

  @HostListener('window:dragover', ['$event']) onDragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.disableOverlay) this.visible = true;
  }

  @HostListener('window:dragleave', ['$event']) onDragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.disableOverlay) this.visible = false;

  }

  @HostListener('drop', ['$event']) onDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.disableOverlay) this.visible = false;


    const files = event.dataTransfer.files;
    if(files?.length) {
      FILE_TYPES[files[0].type] && this.onFileDropped.emit(files[0]);
    }

  }

  constructor() {}

}
