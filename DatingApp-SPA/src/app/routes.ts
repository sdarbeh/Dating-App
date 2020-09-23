import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ListComponent } from './list/list.component';
import { AuthGuard } from './_guards/auth.guard';
import { HomeRedirectGuard } from './_guards/home-redirect.guard';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent, canActivate: [ HomeRedirectGuard ] },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [ AuthGuard ],
    children: [
      { path: 'members', component: MemberListComponent },
      { path: 'messages', component: MessagesComponent },
      { path: 'lists', component: ListComponent },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];