import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RegisterResultComponent } from './components/register-result/register-result.component';
import { HomeComponent } from './components/home/home.component';
import { LoginAuthGuard } from './auth/login-auth.guard';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { TestComponent } from './components/test/test.component';


const routes: Routes = [
  { path: 'test', component: TestComponent },
  { path: 'resetPassword', component: ResetPasswordComponent },
  { path: 'login', component: LoginComponent, data: { animation: 'LoginPage' } },
  { path: 'register', component: RegisterComponent, data: { animation: 'RegisterPage' } },
  { path: 'register/result', component: RegisterResultComponent },
  { path: 'home', component: HomeComponent, canActivate: [LoginAuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
