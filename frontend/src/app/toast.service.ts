import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toast= signal({
    message:'',
    show:false
  })
  showNotification(message: string){
    this.toast.set({
      message: message,
      show: true
    })
    setTimeout(()=>{
      this.toast.set({
        message: '',
        show: false
      })
    },5000)
  }
  constructor() { }
}
