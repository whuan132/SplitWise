import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  showToast= signal(false)
  toastContent= signal('')

  constructor() { }
}
