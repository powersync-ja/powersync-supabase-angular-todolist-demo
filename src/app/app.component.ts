import { Component, OnInit } from '@angular/core'
import { SupabaseService } from './supabase.service'
import { CommonModule } from '@angular/common'
import { AuthComponent } from './auth/auth.component'
import { ListComponent } from './list/list.component'
import { AppSchema } from './powersync.service'
import { WASQLitePowerSyncDatabaseOpenFactory } from '@journeyapps/powersync-sdk-web'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, AuthComponent, ListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'angular-user-management'

  session = this.supabase.session

  constructor(private readonly supabase: SupabaseService) { }

  ngOnInit() {
    (async () => {
      const PowerSyncFactory = new WASQLitePowerSyncDatabaseOpenFactory({
        schema: AppSchema,
        dbFilename: 'test.db'
      })
      const PowerSync = PowerSyncFactory.getInstance()
      console.log(PowerSync)
      try {
        PowerSync.registerListener({ 'initialized': () => console.log('initialized'), 'statusChanged': (status) => console.log(status) })
        await PowerSync.init();
        // await PowerSync.connect(this.supabase);
      } catch (e) {
        console.log(e)
      }
    })()
    this.supabase.authChanges((_, session) => (this.session = session))
  }

}
