import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MaterialModule,
  getTranslateModule,
} from '@exlibris/exl-cloudapp-angular-lib';
import { AlertModule } from '@exlibris/exl-cloudapp-angular-lib';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MainComponent } from './main/main.component';
import { SettingsComponent } from './settings/settings.component';
import { RolePickerComponent } from './settings/role-picker/role-picker.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SettingsComponent,
    RolePickerComponent,
  ],
  imports: [
    MaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    getTranslateModule(),
    ReactiveFormsModule,
    AlertModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
