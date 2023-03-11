import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-multiselect',
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.component.css']
})
export class MultiselectComponent {
  @Input() options: string[] = []
  @Input() placeholder: string = "Select...";
  @Output() selectionChangeEvent = new EventEmitter<string[]>();

  showOptions = false;
  selectedItems: string[] = [];
  filteredOptions: string[] | null = null

  @HostListener("click", ["$event"]) onClick(event: MouseEvent) {
    event.stopPropagation();
  }

  @HostListener("document:click") onOutsideClick() {
    this.showOptions = false;
  }

  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  optionInSelectedOptions(option: string) {
    return this.selectedItems.includes(option);
  }

  onClearClick() {
    this.selectedItems = [];
    this.selectionChangeEvent.emit(this.selectedItems);
  }

  onItemSelect(event: EventTarget | null) {
    if (event) {
      const element = event as HTMLInputElement;
      if (this.selectedItems.includes(element.id)) {
        this.removeItem(element.id);
      } else {
        this.addItem(element.id);
      }
    }
  }

  onButtonClick(event: MouseEvent, item: string) {
    event.stopPropagation();
    this.removeItem(item);
  }

  onOptionClick(event: MouseEvent) {
    event.stopPropagation();
  }

  onSearchInput(term: string) {
    if (term) {
      this.filteredOptions = [];
      this.options.forEach(option => {
        if (option.includes(term)) {
          this.filteredOptions!.push(option);
        }
      })
    }
    else {
      this.filteredOptions = null;
    }
  }

  private removeItem(item: string) {
    this.selectedItems.splice(this.selectedItems.indexOf(item), 1);

    const elem = document.getElementById(item)
    if (elem) {
      (elem as HTMLInputElement).checked = false;
    }

    this.selectionChangeEvent.emit(this.selectedItems);
  }

  private addItem(item: string) {
    this.selectedItems.push(item);

    this.selectionChangeEvent.emit(this.selectedItems);
  }
}
