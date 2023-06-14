import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupsService } from './groups.service';

@Component({
  selector: 'app-add-transaction',
  template: `
    <h2>Add Transaction</h2>
    <form
      class="container"
      [formGroup]="transactionForm"
      (ngSubmit)="addTransaction()"
    >
      <input type="text" placeholder="Title" formControlName="title" />
      <input
        type="text"
        placeholder="Description"
        formControlName="description"
      />
      <input type="text" placeholder="Category" formControlName="category" />
      <input type="number" placeholder="Amount" formControlName="amount" />
      <input type="date" placeholder="Date" formControlName="date" />
      <input
        type="file"
        formControlName="receiptFile"
        accept="image/jpg"
        (change)="pickFile($event)"
      />

      <button type="submit" [disabled]="!transactionForm.valid">
        Add Transaction
      </button>
      <button (click)="goBack()">Back</button>
    </form>
  `,
  styles: [
    `
      .container {
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;
      }
      input,
      button {
        margin-bottom: 10px;
      }
    `,
  ],
})
export class AddTransactionComponent {
  groupId!: string;
  receipt!: File;
  transactionForm = inject(FormBuilder).group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    category: ['', Validators.required],
    amount: ['', Validators.required],
    date: ['', Validators.required],
    receiptFile: '',
  });

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private groupsService = inject(GroupsService);

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.groupId = params.get('group_id') as string;
    });
  }

  pickFile(event: Event) {
    const input_element = event.target as HTMLInputElement;
    if (input_element.files) {
      this.receipt = input_element.files[0];
    }
  }

  addTransaction() {
    if (!this.transactionForm.valid) {
      return;
    }

    const form = this.transactionForm.value;
    const form_data = new FormData();
    form_data.append('title', form.title as string);
    form_data.append('description', form.description as string);
    form_data.append('category', form.category as string);
    form_data.append('amount', form.amount as string);
    form_data.append('date', form.date as string);
    form_data.append('receipt', this.receipt);

    this.groupsService.addTransaction(this.groupId, form_data).subscribe(
      (res) => {
        console.log(res);
        this.goBack();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  goBack() {
    this.router.navigate(['', 'groups', 'detail', this.groupId]);
  }
}
