import {
  Directive,
  ElementRef,
  inject,
  Input
  } from '@angular/core';

@Directive({
  selector: '[app-color]',
})
export class ColorDirective {
  @Input('app-color') owes!: number;

  elementRef = inject(ElementRef);

  ngOnChanges(): void {
    const color = this.owes <= 0 ? 'green' : 'red';
    this.elementRef.nativeElement.style.backgroundColor = color;
  }
}
