import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { BadgeModule } from 'primeng/badge';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

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
  @Input() showDragnDrop: boolean = true; // to show drag and drop area
  @Output() fileSelected = new EventEmitter<File | File[]>(); // Event emitter for selected files

  constructor() {}

  get controlRef(): AbstractControl | null {
    return this.group?.get(this.control) ?? null;
  }

  get isInvalid(): boolean {
    const ctrl = this.controlRef;
    return !!ctrl && ctrl.invalid && (ctrl.touched || ctrl.dirty);
  }

  get hasControlValue(): boolean {
    const value = this.controlRef?.value;
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return !!value;
  }

  get displayLabel(): string {
    const text = (this.label ?? '').trim();
    if (text) {
      return text;
    }
    return this.accept?.toLowerCase().includes('pdf') ? 'document' : 'file';
  }
  
  onUpload(event: any): void {
    const files: File[] = this.extractFiles(event);
    if (!files || files.length === 0) { return; }

    this.setControlFiles(files);
    this.fileSelected.emit(this.multiple ? files : files[0]);
  }

  onSelectedFiles(event: any): void {
    const selectedFiles = this.extractFiles(event);
    if (!selectedFiles.length) { return; }
    this.setControlFiles(selectedFiles);
  }

  onRemoveEvent(event: any): void {
    const files = this.extractFiles(event);
    if (!files.length) {
      this.onClearFiles();
      return;
    }
    this.setControlFiles(files);
  }

  onClearFiles(): void {
    this.controlRef?.setValue(this.multiple ? [] : null);
    this.controlRef?.markAsTouched();
    this.controlRef?.markAsDirty();
  }

  removeSelectedFile(removeFileCallback: any, index: number): void {
    if (removeFileCallback) {
      removeFileCallback(index);
    }

    const remainingFiles = this.getCurrentFiles().filter((_, i) => i !== index);
    this.setControlFiles(remainingFiles);
  }

  hasFiles(files: any[] | null | undefined): boolean {
    return Array.isArray(files) && files.length > 0;
  }

  getSelectionSummary(files: any[] | null | undefined): string {
    if (!this.hasFiles(files)) {
      return this.getUploadHint();
    }

    const fileCount = files!.length;
    if (fileCount === 1) {
      const file = files![0];
      return `${file.name} (${this.formatSize(file.size)})`;
    }

    return `${fileCount} files selected`;
  }

  getUploadHint(): string {
    const parts: string[] = [];
    parts.push(`Upload ${this.displayLabel}`);

    if (this.accept) {
      const allowed = this.accept
        .split(',')
        .map(x => x.trim().replace('.', '').toUpperCase())
        .filter(Boolean)
        .join(', ');
      if (allowed) {
        parts.push(`Allowed: ${allowed}`);
      }
    }

    if (this.maxFileSize) {
      parts.push(`Max ${this.formatSize(this.maxFileSize)}`);
    }

    return parts.join(' | ');
  }

  getFileIconClass(file: File): string {
    const extension = this.getFileExtension(file.name);
    if (extension === 'pdf') {
      return 'pi-file-pdf';
    }
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(extension)) {
      return 'pi-image';
    }
    if (['xls', 'xlsx', 'csv'].includes(extension)) {
      return 'pi-table';
    }
    if (['doc', 'docx', 'txt', 'rtf'].includes(extension)) {
      return 'pi-file';
    }
    return 'pi-file';
  }

  formatSize(size: number): string {
    return size < 1024
      ? `${size} B`
      : size < 1048576
      ? `${(size / 1024).toFixed(2)} KB`
      : `${(size / 1048576).toFixed(2)} MB`;
  }

  private extractFiles(event: any): File[] {
    const rawFiles = event?.currentFiles ?? event?.files ?? [];
    if (!Array.isArray(rawFiles)) {
      return [];
    }
    return rawFiles.filter((file: any) => file instanceof File);
  }

  private setControlFiles(files: File[]): void {
    if (!this.controlRef) { return; }
    this.controlRef.setValue(this.multiple ? files : (files[0] ?? null));
    this.controlRef.markAsTouched();
    this.controlRef.markAsDirty();
  }

  private getCurrentFiles(): File[] {
    const value = this.controlRef?.value;
    if (Array.isArray(value)) {
      return value.filter((file: any) => file instanceof File);
    }
    return value instanceof File ? [value] : [];
  }

  private getFileExtension(fileName: string): string {
    const parts = fileName.toLowerCase().split('.');
    return parts.length > 1 ? parts.pop() ?? '' : '';
  }
}
