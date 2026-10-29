import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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

  public availableModels: string[] = [];
  public years: number[] = Array.from({ length: 30 }, (_, i) => 2026 - i);

  public uploadedImages: string[] = [];
  public imageError: string = '';

  public carForm = new FormGroup({
    brand: new FormControl('', [Validators.required]),
    model: new FormControl({ value: '', disabled: true }, [Validators.required]),
    year: new FormControl('', [Validators.required]),
    mileage: new FormControl('', [Validators.required, Validators.min(0)]),
    engineVolume: new FormControl('', [Validators.required, Validators.min(0.5)]),
    price: new FormControl('', [Validators.required, Validators.min(100)]),
    currency: new FormControl('USD', [Validators.required]),
    description: new FormControl('', [Validators.required, Validators.minLength(10)]),
  });

  ngOnInit(): void {
    this.carServ.getCategories();
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
    this.uploadedImages = [];

    if (!files || files.length < 1) {
      this.imageError = 'აუცილებელია მინიმუმ 1 სურათის ატვირთვა';
      return;
    }
    if (files.length > 4) {
      this.imageError = 'შეგიძლიათ ატვირთოთ მაქსიმუმ 4 სურათი';
      input.value = '';
      return;
    }

    try {
      this.uploadedImages = await Promise.all(Array.from(files).map((f) => this.readFile(f)));
    } catch {
      this.imageError = 'სურათის წაკითხვა ვერ მოხერხდა';
    }
  }

  private readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  public addCar(): void {
    if (this.uploadedImages.length === 0) {
      this.imageError = 'ატვირთეთ მინიმუმ 1 სურათი';
    }
    if (this.carForm.invalid || this.uploadedImages.length === 0) {
      this.carForm.markAllAsTouched();
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

    this.carServ.createListing(newCar).subscribe({
      next: () => this.router.navigateByUrl(AppRoutes.Cars),
      error: (err) => console.error('Error adding car:', err),
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