import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ErrorMsg } from '../../shared/components/error-msg/error-msg';
import { CarsService } from '../../core/services/cars-service/cars-service';
import { ICarListing } from '../../shared/interfaces/cars.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-car',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ErrorMsg],
  templateUrl: './add-car.html',
  styleUrl: './add-car.scss'
})
export class AddCar implements OnInit {
  public carServ = inject(CarsService);
  private router = inject(Router);

  public availableModels: string[] = [];
  public years: number[] = Array.from({ length: 30 }, (_, i) => 2026 - i);
  
  // მასივი ატვირთული სურათების ბაზისისთვის (base64)
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
    // 💡 აქ ვტვირთავთ კატეგორიებს, რომ მარკები გამოჩნდეს დროპდაუნში!
    this.carServ.getCategories();
  }

  public onBrandChange(event: Event): void {
    const selectedBrandName = (event.target as HTMLSelectElement).value;
    const foundCategory = this.carServ.categories().find(c => c.brand === selectedBrandName);

    if (foundCategory) {
      this.availableModels = foundCategory.models;
      this.modelControl.enable();
    } else {
      this.availableModels = [];
      this.modelControl.disable();
    }
    this.modelControl.setValue('');
  }

  // სურათების ატვირთვის ლოგიკა კომპიუტერიდან
  public onFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    this.imageError = '';

    if (files.length < 1) {
      this.imageError = 'აუცილებელია მინიმუმ 1 სურათის ატვირთვა';
      return;
    }
    if (files.length > 4) {
      this.imageError = 'შეგიძლიათ ატვირთოთ მაქსიმუმ 4 სურათი';
      return;
    }

    this.uploadedImages = [];

    // თითოეული ფაილის გადაყვანა Base64 სტრიქონში, რომ შევინახოთ ბაზაში
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedImages.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  public addCar(): void {
    if (this.carForm.invalid || this.uploadedImages.length === 0) {
      if (this.uploadedImages.length === 0) {
        this.imageError = 'ატვირთეთ მინიმუმ 1 სურათი';
      }
      return;
    }

    const formValues = this.carForm.getRawValue();

    const newCar: Partial<ICarListing> = {
      brand: formValues.brand!,
      model: formValues.model!,
      year: Number(formValues.year),
      mileage: Number(formValues.mileage),
      engineVolume: Number(formValues.engineVolume),
      price: Number(formValues.price),
      currency: formValues.currency!,
      description: formValues.description!,
      images: this.uploadedImages // აქ ვწერთ ატვირთულ სურათებს
    };

    this.carServ.createListing(newCar).subscribe({
      next: () => {
        this.router.navigate(['/cars']);
      },
      error: (err) => {
        console.error('Error adding car:', err);
      }
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