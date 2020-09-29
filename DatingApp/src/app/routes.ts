import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ListComponent } from './list/list.component';
import { AuthGuard } from './_guards/auth.guard';
import { HomeRedirectGuard } from './_guards/home-redirect.guard';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolvers/members/member-detail.resolver';
import { MemberListResolver } from './_resolvers/members/member-list.resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './_resolvers/members/member-edit.resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { ListsResolver } from './_resolvers/lists/lists.resolver';
import { MessagesResolver } from './_resolvers/messages/messages.resolver';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent, canActivate: [HomeRedirectGuard] },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'members',
        component: MemberListComponent,
        resolve: { users: MemberListResolver },
      },
      {
        path: 'members/:id',
        component: MemberDetailComponent,
        resolve: { user: MemberDetailResolver },
      },
      {
        path: 'member/edit',
        component: MemberEditComponent,
        resolve: { user: MemberEditResolver },
        canDeactivate: [PreventUnsavedChanges],
      },
      {
        path: 'messages',
        component: MessagesComponent,
        resolve: { messages: MessagesResolver },
      },
      {
        path: 'lists',
        component: ListComponent,
        resolve: { likeUsers: ListsResolver },
      },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
