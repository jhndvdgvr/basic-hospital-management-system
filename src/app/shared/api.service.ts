import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http : HttpClient) { }

  addPatient(data : any){
    return this.http.post<any>("http://localhost:3000/patients", data)
    .pipe(map((res:any)=>{
      return res;
    }))
  }

  getPatients(){
    return this.http.get<any>("http://localhost:3000/patients")
    .pipe(map((res:any)=>{
      return res;
    }))
  }

  getPatientInfo(id:number){
    return this.http.get<any>("http://localhost:3000/patients/"+id)
    .pipe(map((res:any)=>{
      return res;
    }))
  }

  updatePatient(data : any, id:number){
    return this.http.put<any>("http://localhost:3000/patients/"+id, data)
    .pipe(map((res:any)=>{
      return res;
    }))
  }

  deletePatient(data : any, id:number){
    return this.http.delete<any>("http://localhost:3000/patients/"+id, data)
    .pipe(map((res:any)=>{
      return res;
    }))
  }

  addHistory(data : any){
    return this.http.post<any>("http://localhost:3000/history", data)
    .pipe(map((res:any)=>{
      return res;
    }))
  }

  updateHistory(data : any, id:number){
    return this.http.put<any>("http://localhost:3000/history/"+id, data)
    .pipe(map((res:any)=>{
      return res;
    }))
  }

  getPatientHistory(id:number){
    return this.http.get<any>("http://localhost:3000/history/"+id)
    .pipe(map((res:any)=>{
      return res;
    }))
  }
}
