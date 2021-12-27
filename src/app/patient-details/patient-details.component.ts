import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from './../shared/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { PatientHistory } from './patient-details.model';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent implements OnInit {
  patientDetails = {
    name: "", smoking: "",
    alcohol: "", otherDrugUsage: "",
    otherSurgeries: "", drugUsage: {},
    surgeries: {}

  }
  patientId = 0;
  patientHistory !: any;
  bmi !: any;
  validateForm!: FormGroup;

  patientHistoryObj : PatientHistory = new PatientHistory();
  indeterminate = true;

  drugOptions = [
    { label: 'Amphetamines', value: 'Amphetamines', checked: false },
    { label: 'Heroine', value: 'Heroine', checked: false },
    { label: 'Barbiturates', value: 'Barbiturates', checked: false },
    { label: 'Marijuana', value: 'Marijuana', checked: false },
    { label: 'No Drugs', value: 'No Drugs', checked: false }
  ];
  
  surgeriesOptions = [
    { label: 'Heart Surgeries', value: 'Heart Surgeries', checked: false },
    { label: 'Breast Surgery', value: 'Breast Surgery', checked: false },
    { label: 'Leg Surgery', value: 'Leg Surgery', checked: false },
    { label: 'Arm Surgery', value: 'Arm Surgery', checked: false },
  ];

  constructor(
    private fb: FormBuilder, 
    private api: ApiService, 
    private notification: NzNotificationService,
    private route: ActivatedRoute,
    private location: Location
    ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      height: [null, [Validators.required]],
      weight: [null, [Validators.required]],
      smoking: [null, [Validators.required]],
      alcohol: [null, [Validators.required]],
      drugUsage: [null],
      surgeries: [null],
      otherDrugUsage: [],
      otherSurgeries: [],
      bmi: [],
    });
    this.getPatientInformation();
  }

  logDrugs(): void {
    if (this.drugOptions.every(item => !item.checked)) {
      this.indeterminate = false;
    } else if (this.drugOptions.every(item => item.checked)) {
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

  logSurgeries(): void {
    if (this.surgeriesOptions.every(item => !item.checked)) {
      this.indeterminate = false;
    } else if (this.surgeriesOptions.every(item => item.checked)) {
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

  computeBmi(event: any){
    console.log("test")
    const height = Number(this.validateForm.value.height);
    const weight = Number(this.validateForm.value.weight);
    const bmiVal = (weight / ((height * height) / 10000)).toFixed(2);
    this.bmi = bmiVal;
  }

  getPatientInformation () {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.patientId = id;
    this.api.getPatientInfo(id)
    .subscribe(result => {
      console.log(result);
      this.patientDetails = result
    });

    this.api.getPatientHistory(id)
    .subscribe(result => {
      console.log(result);
      this.patientHistory = result;
      this.validateForm.controls["height"].setValue(result.height);
      this.validateForm.controls["weight"].setValue(result.weight);
      this.bmi = result.bmi
      this.validateForm.controls["smoking"].setValue(result.smoking);
      this.validateForm.controls["alcohol"].setValue(result.alcohol);
      this.validateForm.controls["drugUsage"].setValue(result.drugUsage);
      this.validateForm.controls["surgeries"].setValue(result.surgeries);
      this.validateForm.controls["otherDrugUsage"].setValue(result.otherDrugUsage);
      this.validateForm.controls["otherSurgeries"].setValue(result.otherSurgeries);
    });
  }

  goBack(): void {
    this.location.back();
  }

  submitForm(){
    console.log("123213213")
    console.log(this.validateForm.controls)
    if (this.validateForm.valid) {
      console.log(this.patientHistory)
      if (this.patientHistory === undefined) {
        console.log("add");
        this.addPatientHistory();
      } else {
        this.updatePatientHistory()
      }
    } else {
      console.log("HEREEEE")
      Object.values(this.validateForm.controls).forEach(control => {
        console.log(control.value, control.invalid)
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  addPatientHistory(){
    this.patientHistoryObj.id = this.patientId;
    this.patientHistoryObj.height = this.validateForm.value.height;
    this.patientHistoryObj.weight = this.validateForm.value.weight;
    this.patientHistoryObj.bmi = this.bmi;
    this.patientHistoryObj.smoking = this.validateForm.value.smoking;
    this.patientHistoryObj.alcohol = this.validateForm.value.alcohol;
    this.patientHistoryObj.drugUsage = this.validateForm.value.drugUsage;
    this.patientHistoryObj.otherDrugUsage = this.validateForm.value.otherDrugUsage;
    this.patientHistoryObj.surgeries = this.validateForm.value.surgeries;
    this.patientHistoryObj.otherSurgeries = this.validateForm.value.otherSurgeries;

    this.api.addHistory(this.patientHistoryObj)
    .subscribe(result => {
      this.notification.create(
        "success",
        'Success!',
        'Successfully save patient history!'
      );
      this.getPatientInformation();
      this.validateForm.reset();
    }, error => {
      this.notification.create(
        "error",
        'error!',
        'Something went wrong, please try again later.'
      );
    }) 

  }

  updatePatientHistory(){
    this.patientHistoryObj.id = this.patientId;
    this.patientHistoryObj.height = this.validateForm.value.height;
    this.patientHistoryObj.weight = this.validateForm.value.weight;
    this.patientHistoryObj.bmi = this.bmi;
    this.patientHistoryObj.smoking = this.validateForm.value.smoking;
    this.patientHistoryObj.alcohol = this.validateForm.value.alcohol;
    this.patientHistoryObj.drugUsage = this.validateForm.value.drugUsage;
    this.patientHistoryObj.otherDrugUsage = this.validateForm.value.otherDrugUsage;
    this.patientHistoryObj.surgeries = this.validateForm.value.surgeries;
    this.patientHistoryObj.otherSurgeries = this.validateForm.value.otherSurgeries;
    

    this.api.updateHistory(this.patientHistoryObj, this.patientId)
    .subscribe(result => {
      this.notification.create(
        "success",
        'Success!',
        'Successfully updated patient history!'
      );
      this.getPatientInformation();
      this.validateForm.reset();
    })
  }

}
