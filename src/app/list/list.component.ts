import { Component, Input } from "@angular/core";
import { Item } from "../types";
import { CommonModule } from "@angular/common";
import { ItemComponent } from "../item/item.component";
import { AuthSession } from "@supabase/supabase-js";
import { SupabaseService } from "../supabase.service";
import { FormBuilder } from "@angular/forms";
import { AppSchema } from "../powersync.service";
import { WASQLitePowerSyncDatabaseOpenFactory } from "@journeyapps/powersync-sdk-web";

@Component({
  standalone: true,
  selector: "app-list",
  imports: [CommonModule, ItemComponent],
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class ListComponent {
  @Input()
  session!: AuthSession

  constructor(private readonly supabase: SupabaseService, private formBuilder: FormBuilder) { }

  title = "todo";

  filter: "all" | "active" | "done" = "all";

  allItems = [
    { description: "eat", done: true },
    { description: "sleep", done: false },
    { description: "play", done: false },
    { description: "laugh", done: false },
  ];

  get items() {
    if (this.filter === "all") {
      return this.allItems;
    }
    return this.allItems.filter((item) =>
      this.filter === "done" ? item.done : !item.done
    );
  }

  async addItem(description: string) {
    const PowerSync = new WASQLitePowerSyncDatabaseOpenFactory({
      schema: AppSchema,
      dbFilename: 'test.db'
    }).getInstance()
    try {
      console.log("HELLO")
      await PowerSync.init();
      await PowerSync.connect(this.supabase);
      console.log("HELLO2")
    } catch (e) {
      console.log(e)
    }
    console.log("HELLO3")
    this.allItems.unshift({
      description,
      done: false
    });
  }

  remove(item: Item) {
    this.allItems.splice(this.allItems.indexOf(item), 1);
  }
}
