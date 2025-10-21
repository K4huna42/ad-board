import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SafeUrl } from '@angular/platform-browser';
import { Category } from '../../../../features/categories/domains/category.interface';
import { ShortAdvertDtoInterface } from '../../../../infrastructure/adverts/dto';
import { EditAdvertService } from './services/edit-advert.service';
import { CategoriesService } from '../../../../features/categories/services/categories.service';
import { environment } from '../../../../../enviroments/environment.development';
import { AdvertService } from '../../../services/advert.service';

@Component({
  selector: 'app-edit-advert',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-advert.component.html',
  styleUrl: './edit-advert.component.scss',
})
export class EditAdvertComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private editAdvertService = inject(EditAdvertService);
  private categoriesService = inject(CategoriesService);
  private advertService = inject(AdvertService);

  form!: FormGroup;
  advertId!: string;
  advertData!: ShortAdvertDtoInterface | null;
  images: { file?: File; url: SafeUrl }[] = [];
  items: string[] = [];
  value = '';

  categories = this.categoriesService.categories;
  selectedRootId = signal<string | null>(null);
  selectedSubId = signal<string | null>(null);
  selectedRoot = signal<Category | null>(null);

  constructor() {
    this.advertId = this.route.snapshot.paramMap.get('id')!;
    this.categoriesService.loadAllCategories();

    this.editAdvertService.loadAdvert(this.advertId).subscribe((advert) => {
      this.images = (advert.imagesIds ?? []).map((id) => ({
        url: `${environment.baseApiURL}/Images/${id}`,
      }));

      this.form = this.fb.group({
        name: [advert.name, Validators.required],
        description: [advert.description],
        cost: [advert.cost, Validators.required],
        location: [advert.location, Validators.required],
        email: [advert.email],
        phone: [advert.phone, Validators.required],
        categoryId: ['', Validators.required],
        subCategoryId: [null, Validators.required],
        imagesIds: [[]],
      });
    });

    effect(() => {
      const id = this.selectedRootId();
      const found = this.categories().find((c) => c.id === id) || null;
      this.selectedRoot.set(found);
    });
  }
  onRootCategorySelect(event: Event) {
    const id = (event.target as HTMLSelectElement).value;
    this.form.get('categoryId')?.setValue(id);
    this.selectedRootId.set(id);
    this.selectedSubId.set(null);

    const root = this.categories().find((c) => c.id === id);
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

    const availableSlots = 10 - this.images.length;
    if (availableSlots <= 0) {
      input.value = '';
      return;
    }

    const filesToAdd = files.slice(0, availableSlots);

    for (const file of filesToAdd) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result as string;
        this.images.push({ file, url: result });
      };
      reader.readAsDataURL(file);
    }

    input.value = '';
  }

  removeImage(index: number) {
    this.images.splice(index, 1);
  }

  sendCity(event: Event | { query: string }): void {
    const input = event as Event;
    let query = 'query' in event ? event.query : ((input.target as HTMLInputElement)?.value ?? '');
    if ('query' in event) {
      query = event.query;
    } else {
      const target = event.target as HTMLInputElement | null;
      query = target?.value ?? '';
    }

    this.advertService.searchCity(query).subscribe((cities) => {
      this.items = cities;
    });
  }

  selectCity(city: string) {
    this.value = city;
    this.items = [];
    this.form.get('location')?.setValue(city);
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const formData = new FormData();
    Object.entries(this.form.value).forEach(([key, value]) => {
      if (value != null) formData.append(key, value as string);
    });

    this.images.forEach((image) => {
      if (image.file) formData.append('images', image.file);
    });

    this.editAdvertService.updateAdvert(this.advertId, formData).subscribe({
      next: () => this.router.navigate(['/my-adverts']),
      error: (err) => console.error('Ошибка при сохранении:', err),
    });
  }

  getFileSize(size: number | undefined): string {
    if (size) {
      return size < 1024 * 1024
        ? `${(size / 1024).toFixed(1)} КБ`
        : `${(size / 1024 / 1024).toFixed(1)} МБ`;
    } else {
      return '';
    }
  }
}
