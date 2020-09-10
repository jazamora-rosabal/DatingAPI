import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-members-filter',
  templateUrl: './members-filter.component.html',
  styleUrls: ['./members-filter.component.css'],
})
export class MembersFilterComponent implements OnInit {
  customRange = false;
  minAge: number;
  maxAge: number;
  @Input() genderDef: string;
  filterForm: FormGroup;
  ageCategories: any = [
    {
      name: 'Beetwen 18 and 35',
      range: '18-35',
    },
    {
      name: 'Beetwen 35 and 50',
      range: '35-50',
    },
    {
      name: 'Beetwen 50 and 70',
      range: '50-70',
    },
    {
      name: 'Older than 70',
      range: '70-99',
    },
    {
      name: 'Default',
      range: '18-99',
    },
  ];
  readyToFiltered = true;
  readyToReset = false;
  userParams: any = {};
  @Output() filtersChanges = new EventEmitter<any>();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createFilterForm();
  }

  createFilterForm(): void {
    this.filterForm = this.formBuilder.group(
      {
        ageRange: ['18-99'],
        gender: [this.genderDef],
        minAgeCustom: [null, Validators.min(18)],
        maxAgeCustom: [null, Validators.max(99)],
      },
      {
        validators: [
          this.checkCustomRangeIsEmptyForMinAge,
          this.checkCustomRangeIsEmptyForMaxAge,
          this.checkRangeAge,
        ],
      }
    );
  }

  setMinAgeValue() {
    this.minAge = this.filterForm.get('minAgeCustom').value != null ? this.filterForm.get('minAgeCustom').value : 18;
    if (this.filterForm.get('maxAgeCustom').value == null) {
      this.maxAge = 99;
    }
  }

  setMaxAgeValue() {
    this.maxAge = this.filterForm.get('maxAgeCustom').value != null ? this.filterForm.get('maxAgeCustom').value : 99;
    if (this.filterForm.get('minAgeCustom').value == null) {
      this.minAge = 18;
    }
  }

  isReadyToFileter(): boolean{
    this.readyToFiltered = true;
    if ( (this.filterForm.touched && this.filterForm.invalid) || !this.filterForm.dirty) {
          this.readyToFiltered = false;
    }
    return this.readyToFiltered;
  }

  
  changeCustomRangeStatus() {
    this.customRange = false;
    this.filterForm.get('minAgeCustom').setValue(null);
    this.filterForm.get('minAgeCustom').markAsUntouched({ onlySelf: false });
    this.filterForm.get('maxAgeCustom').setValue(null);
    this.filterForm.get('maxAgeCustom').markAsUntouched({ onlySelf: true });
  }

  setMinMaxAge(): void {
    const valorRango = this.filterForm.get('ageRange').value;
    switch (valorRango) {
      case '18-35': {
        this.minAge = 18;
        this.maxAge = 35;
        break;
      }
      case '35-50': {
        this.minAge = 35;
        this.maxAge = 50;
        break;
      }
      case '50-70': {
        this.minAge = 50;
        this.maxAge = 70;
        break;
      }
      case '70-99': {
        this.minAge = 70;
        this.maxAge = 99;
        break;
      }
      case 'Default': {
        this.minAge = 18;
        this.maxAge = 99;
        break;
      }
      default:
        break;
    }
    this.userParams.minAge = this.minAge;
    this.userParams.maxAge = this.maxAge;
  }

  filterUpdate() {
    if (this.filterForm.valid) {
      this.userParams.gender = this.filterForm.get('gender').value;
      this.setMinMaxAge();
      console.log(this.userParams);
      this.filtersChanges.emit(this.userParams);
      this.readyToReset = true;
    } else {
      return;
    }
  }

  resetFilter(){
    this.filterForm.get('gender').setValue(this.genderDef);
    this.filterForm.get('ageRange').setValue('18-99');
    this.filterForm.get('minAgeCustom').setValue(null);
    this.filterForm.get('maxAgeCustom').setValue(null);
    this.customRange =  false;
    this.minAge = 18;
    this.maxAge = 99;
    this.filterUpdate();
    this.readyToReset = false;
  }


  checkCustomRangeIsEmptyForMinAge(g: FormGroup) {
    if (g.get('ageRange').value !== 'custom') {
      return null;
    }
    if (
      g.get('minAgeCustom').value === null &&
      g.get('maxAgeCustom').value === null
    ) {
      return { noMinAgeRange: true };
    } else {
      return null;
    }
  }

  checkCustomRangeIsEmptyForMaxAge(g: FormGroup) {
    if (g.get('ageRange').value !== 'custom') {
      return null;
    }
    if (
      g.get('maxAgeCustom').value === null &&
      g.get('minAgeCustom').value === null
    ) {
      return { noMaxAgeRange: true };
    } else {
      return null;
    }
  }
// VALIDATORS
  checkRangeAge(g: FormGroup) {
    if (g.get('ageRange').value !== 'custom') {
      return null;
    }
    if (
      g.get('maxAgeCustom').value !== null &&
      g.get('minAgeCustom').value !== null &&
      g.get('minAgeCustom').value >= g.get('maxAgeCustom').value
    ) {
      return { noAgeRange: true };
    } else {
      return null;
    }
  }

  addClassToMinMaxAgeCustomValid(fieldName: string, errorName: string): string {
    if (
      this.isFieldTouched(fieldName) &&
      (this.filterForm.get(fieldName).errors ||
        this.filterForm.hasError(errorName) ||
        this.filterForm.hasError('noAgeRange'))
    ) {
      return 'is-invalid';
    }
    return 'is-valid';
  }

  isFieldTouched(fieldName: string): boolean {
    return this.filterForm.get(fieldName).touched;
  }
}
