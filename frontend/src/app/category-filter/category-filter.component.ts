import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.css']
})
export class CategoryFilterComponent {
  @Input() options!: string[];
  @Output() changeEvent = new EventEmitter<string[]>();

  selectedOptions: string[] = [];
  filterInput = "";
  filteredOptions: string[] | null = null;

  onOptionClick(option: string) {
    if (this.selectedOptions.includes(option)) {
      this.selectedOptions.splice(this.selectedOptions.indexOf(option), 1);
    } else {
      this.selectedOptions.push(option);
    }
    this.emit();
  }

  optionSelected(option: string) {
    return this.selectedOptions.includes(option);
  }

  clear() {
    this.selectedOptions = [];
    this.emit();
  }

  filterInputChange() {
    if (this.filterInput) {
      this.filteredOptions = [];
      this.options.forEach(option => {
        if (option.includes(this.filterInput)) {
          this.filteredOptions!.push(option);
        }
      });
    } else {
      this.filteredOptions = null;
    }
  }

  emit() {
    this.changeEvent.emit(this.selectedOptions);
  }
}
