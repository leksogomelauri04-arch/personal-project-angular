import { Service } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Service()
export class SpinnerService {
    public $spinnerOn = new BehaviorSubject(false);
}
