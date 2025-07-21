import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { BadgeModule } from 'primeng/badge';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'z-file-upload',
  standalone: true,
  imports: [ReactiveFormsModule, FileUploadModule, ToastModule, CommonModule, BadgeModule],
  templateUrl: './z-file-upload.component.html',
  styleUrl: './z-file-upload.component.scss'
})
export class ZFileUploadComponent {
  @Input() group!: FormGroup; // Parent's FormGroup
  @Input() control!: string; // Name of the form control
  @Input() label!: string; // Label text
  @Input() validationMessage!: string; // Custom validation message
  @Input() multiple: boolean = false; // Multiple file upload
  @Input() accept: string = ''; // Accepted file types
  @Input() maxFileSize: number = 1048576; // Maximum file size

  constructor() {}

  ngOnInit(): void {}

  onSelectedFiles(event: any): void {
    console.log(event);
    const selectedFiles = this.multiple ? Array.from(event.currentFiles) : [event.currentFiles[0]];
    this.group.get(this.control)?.setValue(selectedFiles);
    this.group.get(this.control)?.markAsTouched();
  }

  onRemoveFile(fileIndex: number): void {
    const files = this.group.get(this.control)?.value || [];
    files.splice(fileIndex, 1);
    this.group.get(this.control)?.setValue(files);
  }

  formatSize(size: number): string {
    return size < 1024
      ? `${size} B`
      : size < 1048576
      ? `${(size / 1024).toFixed(2)} KB`
      : `${(size / 1048576).toFixed(2)} MB`;
  }
}
