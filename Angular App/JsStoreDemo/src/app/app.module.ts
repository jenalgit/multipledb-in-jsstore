import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { StudentComponent } from './student/student.component';
import { LibraryComponent } from './library/library.component';
import { CommonService } from './service/common.service';

@NgModule({
  declarations: [
    AppComponent,
    StudentComponent,
    LibraryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [CommonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
