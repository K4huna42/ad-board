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
  styleUrl: './edit-advert.component.scss'
})
export class EditAdvertComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private editAdvertService = inject(EditAdvertService);
  private categoriesService = inject(CategoriesService);
  private advertService = inject(AdvertService)

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

    // Загружаем данные объявления (только для отображения, не для авто-подстановки категорий)
    this.editAdvertService.loadAdvert(this.advertId).subscribe(advert => {
      this.images = (advert.imagesIds ?? []).map(id => ({
        url: `${environment.baseApiURL}/Images/${id}`,
      }));

      // создаём пустую форму, пользователь сам выбирает категории
      this.form = this.fb.group({
        name: [advert.name, Validators.required],
        description: [advert.description],
        cost: [advert.cost, Validators.required],
        location: [advert.location, Validators.required],
        email: [advert.email],
        phone: [advert.phone],
        categoryId: ['', Validators.required],
        imagesIds: [[]],
      });
    });

    // Следим за выбранной корневой категорией
    effect(() => {
      const id = this.selectedRootId();
      const found = this.categories().find(c => c.id === id) || null;
      this.selectedRoot.set(found);
    });
  }

  ngOnInit(): void {

  }
  onRootCategorySelect(event: Event) {
    const id = (event.target as HTMLSelectElement).value;
    this.form.get('categoryId')?.setValue(id);
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

  sendCity(event: any) {
    const query = event.target?.value || event.query;

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

    this.images.forEach(image => {
      if (image.file) formData.append('images', image.file);
    });

    this.editAdvertService.updateAdvert(this.advertId, formData).subscribe({
      next: () => this.router.navigate(['/my-adverts']),
      error: err => console.error('Ошибка при сохранении:', err),
    });
  }
}
