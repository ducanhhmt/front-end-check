import { Component, Input  } from '@angular/core';

@Component({
  selector: 'app-manage-header',
  standalone: true,
  imports: [],
  templateUrl: './manage-header.component.html',
  styleUrl: './manage-header.component.css'
})
export class ManageHeaderComponent {
  @Input() titleHeader: string = '';
}
