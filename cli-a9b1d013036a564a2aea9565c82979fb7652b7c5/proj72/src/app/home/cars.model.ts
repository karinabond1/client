import { HttpClientModule} from '@angular/common/http';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [
      HttpClientModule
    ],
    providers: [],
    bootstrap: []
  })

export class Cars{
    id: number;
    brand: string;
    model :string;
}