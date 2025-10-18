import { Component, effect, inject, signal } from '@angular/core';
import { Category } from '../../../../features/categories/domains/category.interface';
import { CategoriesService } from '../../../../features/categories/services/categories.service';
import { SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NewAdvertService } from './services/new-advert.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShortAdvertDtoInterface } from '../../../../infrastructure/adverts/dto';
import { AdvertService } from '../../../services/advert.service';

@Component({
  selector: 'app-new-advert',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './new-advert.component.html',
  styleUrl: './new-advert.component.scss'
})
export class NewAdvertComponent {
  private categoriesService = inject(CategoriesService)
  private newAdvertService = inject(NewAdvertService)
  private advertService = inject(AdvertService)
  private fb = inject(FormBuilder);

  images: { file: File, url: SafeUrl }[] = [];
  value = '';
  items: string[] = [];
  newAdvertForm: FormGroup
  advertForm!: FormGroup;
  advertId!: string;
  advertData?: ShortAdvertDtoInterface;
  isLoading = true;

  categories = this.categoriesService.categories;

  selectedRootId = signal<string | null>(null);
  selectedSubId = signal<string | null>(null);
  selectedRoot = signal<Category | null>(null);

  constructor() {
    this.newAdvertForm = this.fb.group({
      categoryId: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      location: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      cost: [0, [Validators.required]],
      images: [[], [Validators.required]],
    }
    )

    this.categoriesService.loadAllCategories();

    effect(() => {
      const id = this.selectedRootId();
      const found = this.categories().find(c => c.id === id) || null;
      this.selectedRoot.set(found);
    });
  }

  onRootCategorySelect(event: Event) {
    const id = (event.target as HTMLSelectElement).value;
    this.newAdvertForm.get('categoryId')?.setValue(id);
    this.selectedRootId.set(id);
    this.selectedSubId.set(null);

    const root = this.categories().find(c => c.id === id);
    if (root?.hasChildren && !root.childs?.length) {
      this.categoriesService.tumblerCategory(root);
    }
  }

  onSubCategorySelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedSubId.set(select.value);
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files);

    for (const file of files) {
      if (this.images.length >= 10) break;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.images.push({ file, url: e.target.result });
      };
      reader.readAsDataURL(file);
    }

    input.value = '';
  }

  removeImage(index: number) {
    this.images.splice(index, 1);
  }

  getFileSize(size: number): string {
    return size < 1024 * 1024
      ? `${(size / 1024).toFixed(1)} КБ`
      : `${(size / 1024 / 1024).toFixed(1)} МБ`;
  }

  sendCity(event: any) {
    const query = event.target?.value || event.query;

    this.advertService.searchCity(query).subscribe((cities) => {
      this.items = cities;
    });
  }

  selectCity(city: string) {
    this.value = city;
    this.items = [];
  }

  sendAdvert() {
    const formData = new FormData();
    const formValue = this.newAdvertForm.value;

    for (const key in formValue) {
      if (formValue.hasOwnProperty(key)) {
        formData.append(key, formValue[key]);
      }
    }

    this.newAdvertService.createNewAdvret(formData)
  }
}