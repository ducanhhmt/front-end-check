import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserComponent } from './user/user.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,UserComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'example_AngularPrj';
  user: any = { name: 'An' };
  changeName() {
    // this.user.name = 'Bình';
      this.user = {
    ...this.user,
    name: 'Bình'
  };

  }
}
