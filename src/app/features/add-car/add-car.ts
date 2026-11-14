import { Component, effect, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ErrorMsg } from '../../shared/components/error-msg/error-msg';
import { CarsService } from '../../core/services/cars-service/cars-service';
import { AuthService } from '../../core/services/user-services/auth-service';
import { ICarListing } from '../../shared/interfaces/cars.interface';
import { AppRoutes } from '../../core/enums/app-routes.enum';

@Component({
  selector: 'app-add-car',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ErrorMsg],
  templateUrl: './add-car.html',
  styleUrl: './add-car.scss',
})
export class AddCar implements OnInit {
  public carServ = inject(CarsService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public availableModels: string[] = [];
  public years: number[] = Array.from({ length: 30 }, (_, i) => 2026 - i);

  public uploadedImages: string[] = [];
  public imageError: string = '';
  public isProcessingImages = false;

  public editId: string | null = null;

  private readonly MAX_IMAGES = 1;
  private readonly MAX_SIZE = 1024;
  private readonly QUALITY = 0.7;

  public carForm = new FormGroup({
    brand: new FormControl('', [Validators.required]),
    model: new FormControl({ value: '', disabled: true }, [Validators.required]),
    year: new FormControl('', [Validators.required]),
    mileage: new FormControl('', [Validators.required, Validators.min(0)]),
    engineVolume: new FormControl('', [Validators.required, Validators.min(0.1)]),
    price: new FormControl('', [Validators.required, Validators.min(1)]),
    currency: new FormControl('USD', [Validators.required]),
    description: new FormControl('', [Validators.required, Validators.minLength(10)]),
  });

  constructor() {
    effect(() => {
      const categories = this.carServ.categories();
      const brand = this.brandControl.value;
      if (brand && categories.length > 0) {
        const found = categories.find((c) => c.brand === brand);
        this.availableModels = found ? found.models : [];
      }
    });
  }

  ngOnInit(): void {
    this.carServ.getCategories();

    this.editId = this.route.snapshot.paramMap.get('id');
    if (this.editId) {
      this.loadForEdit(this.editId);
    }
  }

  private loadForEdit(id: string): void {
    this.carServ.getListingById(id).subscribe({
      next: (car) => {
        const user = this.auth.currentUser();
        if (!user || String(car.userId) !== String(user.id)) {
          this.router.navigateByUrl(AppRoutes.Cars);
          return;
        }

        const found = this.carServ.categories().find((c) => c.brand === car.brand);
        this.availableModels = found ? found.models : [];
        this.modelControl.enable();

        this.carForm.patchValue({
          brand: car.brand,
          model: car.model,
          year: String(car.year),
          mileage: String(car.mileage),
          engineVolume: String(car.engineVolume),
          price: String(car.price),
          currency: car.currency,
          description: car.description,
        });
        this.uploadedImages = car.images ?? [];
      },
      error: (err) => console.error('ჩატვირთვა ვერ მოხერხდა:', err),
    });
  }

  public onBrandChange(event: Event): void {
    const selectedBrandName = (event.target as HTMLSelectElement).value;
    const foundCategory = this.carServ.categories().find((c) => c.brand === selectedBrandName);

    if (foundCategory) {
      this.availableModels = foundCategory.models;
      this.modelControl.enable();
    } else {
      this.availableModels = [];
      this.modelControl.disable();
    }
    this.modelControl.setValue('');
  }

  public async onFilesSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    this.imageError = '';

    if (!files || files.length < 1) return;

    if (files.length > this.MAX_IMAGES) {
      this.imageError = `შეგიძლიათ ატვირთოთ მაქსიმუმ ${this.MAX_IMAGES} სურათი`;
      input.value = '';
      return;
    }
 
    const file = files[0];
    const name = file.name.toLowerCase();

    if (/\.(heic|heif)$/.test(name) || /hei[cf]/.test(file.type)) {
      this.imageError = 'HEIC ფორმატი არ არის მხარდაჭერილი, გამოიყენეთ JPG ან PNG';
      input.value = '';
      return;
    }
    if (!file.type.startsWith('image/')) {
      this.imageError = 'ატვირთეთ მხოლოდ სურათები';
      input.value = '';
      return;
    }

    this.isProcessingImages = true;
    try {
      this.uploadedImages = [await this.readFile(file)];
    } catch (err) {
      console.error('სურათის დამუშავების შეცდომა:', file.name, file.type, file.size, err);
      this.uploadedImages = [];
      this.imageError = 'ეს სურათი ვერ დამუშავდა, სცადეთ სხვა (JPG ან PNG)';
      input.value = '';
    } finally {
      this.isProcessingImages = false;
    }
  }

  private async readFile(file: File): Promise<string> {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });

    const scale = Math.min(1, this.MAX_SIZE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas მიუწვდომელია');

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    return canvas.toDataURL('image/jpeg', this.QUALITY);
  }

  public addCar(): void {
    if (this.isProcessingImages) return;

    if (this.uploadedImages.length === 0) {
      this.imageError = 'ატვირთეთ მინიმუმ 1 სურათი';
    }

    if (this.carForm.invalid || this.uploadedImages.length === 0) {
      this.carForm.markAllAsTouched();
      const bad = Object.entries(this.carForm.controls)
        .filter(([, c]) => c.invalid)
        .map(([k]) => k);
      console.warn('ფორმა არასწორია:', bad, 'images:', this.uploadedImages.length);
      return;
    }

    const user = this.auth.currentUser();
    if (!user?.id) {
      this.router.navigateByUrl(AppRoutes.Login);
      return;
    }

    const formValues = this.carForm.getRawValue();

    const newCar: Partial<ICarListing> = {
      userId: user.id,
      brand: formValues.brand!,
      model: formValues.model!,
      year: Number(formValues.year),
      mileage: Number(formValues.mileage),
      engineVolume: Number(formValues.engineVolume),
      price: Number(formValues.price),
      currency: formValues.currency!,
      description: formValues.description!,
      images: this.uploadedImages,
    };

    const request$ = this.editId
      ? this.carServ.updateListing(this.editId, newCar)
      : this.carServ.createListing(newCar);

    request$.subscribe({
      next: () => this.router.navigateByUrl(this.editId ? '/my-listings' : AppRoutes.Cars),
      error: (err) => console.error('შენახვა ვერ მოხერხდა:', err),
    });
  }

  public get brandControl() { return this.carForm.get('brand') as FormControl; }
  public get modelControl() { return this.carForm.get('model') as FormControl; }
  public get yearControl() { return this.carForm.get('year') as FormControl; }
  public get mileageControl() { return this.carForm.get('mileage') as FormControl; }
  public get engineVolumeControl() { return this.carForm.get('engineVolume') as FormControl; }
  public get priceControl() { return this.carForm.get('price') as FormControl; }
  public get descriptionControl() { return this.carForm.get('description') as FormControl; }
}