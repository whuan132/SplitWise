import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {Modal, ModalOptions} from "flowbite";

@Component({
  selector: 'app-modal',
  template: `
    <div>

      <!-- Modal toggle -->
      <button (click)="showModal()" *ngIf="!button" type="button" data-dial-toggle="speed-dial-menu-default"
      aria-controls="speed-dial-menu-default" aria-expanded="false"
      class="flex items-center justify-center text-white bg-blue-700 rounded-full w-14 h-14 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800">
      <svg aria-hidden="true" class="w-8 h-8 transition-transform group-hover:rotate-45" fill="none"
           stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
      </svg>
      <span class="sr-only">Open actions menu</span>
      </button>
      <button *ngIf="button" (click)="showModal()" class="block text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800 w-full max-w-2xl" type="button">
        {{button}}
      </button>

      <!-- Main modal -->
      <div id="custom-modal" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <div class="relative w-full max-w-md max-h-full">
          <!-- Modal content -->
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="custom-modal" id="close-icon">
              <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
              <span class="sr-only">Close modal</span>
            </button>
            <div class="px-6 py-6 lg:px-8">
              <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">{{title}}</h3>
              <form class="space-y-6" action="#" [formGroup]="form" (ngSubmit)="onSubmit()">
                <div *ngFor="let field of fields">
                  <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{field}}</label>
                  <input type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com"  formControlName="field">
                </div>
                <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 " data-modal-hide="custom-modal" >Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>


    </div>
  `,
  styles: [
  ]
})
export class ModalComponent {
  closeModal='';
  @Input({required: true, alias: 'title'}) title!:string;
@Input({required: true, alias: 'fields'}) fields!: string[];
@Input({required:false, alias:'button'}) button!:string;
@Output('add') groupName= new EventEmitter<string>();
form= inject(FormBuilder).group({
  field:['',[Validators.required,Validators.min(5)]]
})
  onSubmit(){
    console.log(this.form.value.field)
    if(this.form.status==='VALID') {

      this.groupName.emit(this.form.value.field as string)


    } else{
      console.log("invalid form")
    }


}
  showModal(){

    const $modalElement = document.querySelector('#custom-modal') as HTMLElement;

    const modalOptions = {
      placement: 'center',
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
      onHide: () => {
        console.log('modal is hidden');
      },
      onShow: () => {
        console.log('modal is shown');
      },
      onToggle: () => {
        console.log('modal has been toggled');
      }
    }

    const modal = new Modal($modalElement, modalOptions as ModalOptions);
    modal._init()
    modal.show();

      const icon = document.getElementById('close-icon');
      if(icon)
      icon.addEventListener('click', () => {
        modal.hide();
      })


  }

}

