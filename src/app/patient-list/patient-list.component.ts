import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { ApiService } from './../shared/api.service';
import { PatientModel } from './patient-list.model';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {

  isVisible = false;
  isDeleteModalVisible = false;
  validateForm!: FormGroup;
  patientModelObj : PatientModel = new PatientModel();
  formModalTitle = 'Add Patient';
  selectedPatient = {
    name: "",
    id: 0
  };
  forUpdate = false;
  patientList !: any
  dateFormat = "MM/dd/yyyy";
  captchaTooltipIcon: NzFormTooltipIcon = {
    type: 'info-circle',
    theme: 'twotone'
  };

  constructor(
    private fb: FormBuilder, 
    private api: ApiService, 
    private notification: NzNotificationService) {}

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
      this.notification.create(
        "success",
        'Success!',
        'Successfully added new patient!'
      );
      this.getAllPatient();
      this.validateForm.reset();
      this.handleCancel();
    }, error => {
      this.notification.create(
        "error",
        'error!',
        'Something went wrong, please try again later.'
      );
    }) 
  }

  getAllPatient(){
    this.api.getPatients()
    .subscribe(result => {
      this.patientList = result;
    })
  }

  deletePatient(){
    this.api.deletePatient(this.selectedPatient, this.selectedPatient.id)
    .subscribe(result => {
      this.notification.create(
        "success",
        'Success!',
        'Successfully deleted patient!'
      );
      this.getAllPatient();
      this.closeDeleteModal();
      this.selectedPatient = {
        name: "",
        id: 0
      };
    })
  }

  onEdit(patient: any){
    this.patientModelObj.id = patient.id
    this.validateForm.controls["name"].setValue(patient.name);
    this.validateForm.controls["age"].setValue(patient.age);
    this.validateForm.controls["sex"].setValue(patient.sex);
    this.validateForm.controls["checkInDate"].setValue(patient.checkInDate);
  }

  updatePatient(){
    this.patientModelObj.name = this.validateForm.value.name;
    this.patientModelObj.age = this.validateForm.value.age;
    this.patientModelObj.sex = this.validateForm.value.sex;
    this.patientModelObj.checkInDate = moment(this.validateForm.value.checkInDate).format("MM/DD/yyyy");
    
    this.api.updatePatient(this.patientModelObj, this.patientModelObj.id)
    .subscribe(result => {
      this.notification.create(
        "success",
        'Success!',
        'Successfully updated patient!'
      );
      this.getAllPatient();
      this.validateForm.reset();
      this.handleCancel();
    })
  }

  onDelete(patient: any){
    this.isDeleteModalVisible = true;
    this.selectedPatient = patient;
  }

  closeDeleteModal(){
    this.isDeleteModalVisible = false;
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
      this.formModalTitle = "Edit Patient"
    } else {
      this.patientModelObj.id = 0;
      this.formModalTitle = "Add Patient"
    }
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
    this.forUpdate = false;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.forUpdate = false;
    this.getAllPatient();
    this.validateForm.reset();
  }

}
