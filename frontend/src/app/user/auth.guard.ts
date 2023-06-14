import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { StateService } from './state.service';

export const authGuard: CanActivateFn = (route, state) => {
  const stateService = inject(StateService);
  const user = stateService.user();
  if (user._id === '' || user.email === '' || user.token === '') {
    inject(Router).navigate(['', 'signin']);
    return false;
  }
  return true;
};
