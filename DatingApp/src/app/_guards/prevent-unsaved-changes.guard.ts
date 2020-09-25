import { Injectable } from '@angular/core';
import { CanDeactivate, Router } from '@angular/router';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';
import { AlertifyService } from '../_services/alertify/alertify.service';

@Injectable({
  providedIn: 'root',
})
export class PreventUnsavedChanges implements CanDeactivate<MemberEditComponent> {

  constructor(private router: Router, private alertify: AlertifyService) {}

  canDeactivate(component: MemberEditComponent): boolean {
    if (component.editForm.dirty) {
      return confirm('Are you sure you want to continue?');
    }
    return true;
  }
}
