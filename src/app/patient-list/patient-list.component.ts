import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { ApiService } from './../shared/api.service';
import { PatientModel } from './patient-list.model';
import * as moment from 'moment';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {

  isVisible = false;
  validateForm!: FormGroup;
  patientModelObj : PatientModel = new PatientModel();
  forUpdate = false;
  patientList !: any
  dateFormat = "MM/dd/yyyy";
  captchaTooltipIcon: NzFormTooltipIcon = {
    type: 'info-circle',
    theme: 'twotone'
  };

  constructor(private fb: FormBuilder, private api: ApiService) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      age: [null, [Validators.required]],
      sex: [null, [Validators.required]],
      checkInDate: [null, [Validators.required]],
    });
    this.getAllPatient();
  }


  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      if (this.forUpdate) {
        this.updatePatient();
      } else {
        this.addNewPatient();
      }
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  addNewPatient(){
    this.patientModelObj.name = this.validateForm.value.name;
    this.patientModelObj.age = this.validateForm.value.age;
    this.patientModelObj.sex = this.validateForm.value.sex;
    this.patientModelObj.checkInDate = moment(this.validateForm.value.checkInDate).format("MM/DD/yyyy");

    this.api.addPatient(this.patientModelObj)
    .subscribe(result => {
      console.log(result);
      alert("Patient added successfully!");
      this.getAllPatient();
      this.validateForm.reset();
      this.handleCancel();
    }, error => {
      alert("Something went wrong, Please try again.");
    }) 
  }

  getAllPatient(){
    this.api.getPatients()
    .subscribe(result => {
      this.patientList = result;
    })
  }

  deletePatient(patient: any){
    this.api.deletePatient(patient, patient.id)
    .subscribe(result => {
      alert("patient deleted");
      this.getAllPatient();
    })
  }

  onEdit(patient: any){
    this.patientModelObj.id = patient.id
    this.validateForm.controls["name"].setValue(patient.name);
    this.validateForm.controls["age"].setValue(patient.age);
    this.validateForm.controls["sex"].setValue(patient.sex);
    this.validateForm.controls["checkInDate"].setValue(patient.checkInDate);
    // this.showModal();
  }

  updatePatient(){
    this.patientModelObj.name = this.validateForm.value.name;
    this.patientModelObj.age = this.validateForm.value.age;
    this.patientModelObj.sex = this.validateForm.value.sex;
    this.patientModelObj.checkInDate = moment(this.validateForm.value.checkInDate).format("MM/DD/yyyy");
    console.log(this.patientModelObj)
    this.api.updatePatient(this.patientModelObj, this.patientModelObj.id)
    .subscribe(result => {
      alert("patient updated");
      this.getAllPatient();
      this.validateForm.reset();
      this.handleCancel();
    })
  }

  onDelete(patient: any){

  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } 
    return {};
  };

  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }

  showModal(forUpdate : boolean, patient: any): void {
    if (forUpdate) {
      this.onEdit(patient);
      this.forUpdate = true;
    } else {
      this.patientModelObj.id = 0;
    }
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
    this.forUpdate = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
    this.forUpdate = false;
    this.getAllPatient();
    this.validateForm.reset();
  }

}
