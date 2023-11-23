import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from '@angular/common';
import { type Todo } from "../types";
import { PowerSyncService, TODOS_TABLE } from "../powersync.service";

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent {
  @Input()
  userId!: string
  @Input()
  todo!: Todo

  @Output() remove = new EventEmitter<Todo>();

  editable = false;

  constructor(
    private readonly powerSync: PowerSyncService,
  ) { }



  saveTodo(description: string) {
    if (!description) return;
    this.editable = false;
    this.todo.description = description;
  }

  async editTodo(description: string) {
    if (!description) return;
    this.editable = false;
    await this.powerSync.db.execute(`
      UPDATE ${TODOS_TABLE}
      SET description = ?
      WHERE id = ?
    `, [description, this.todo.id]);
  }
}
