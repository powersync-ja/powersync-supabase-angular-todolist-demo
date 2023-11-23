import { Component, OnInit } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { PowerSyncService } from './powersync.service';
import { ChangeDetectorRef } from '@angular/core';
import { ListsComponent } from './lists/lists.component';
import { Router, RouterOutlet } from '@angular/router';
import { Observable, Subscription, of } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LoginComponent, ListsComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-user-management';
  private subscription!: Subscription;
  connected = false
  isLoggedIn = false;


  constructor(
    private supabase: SupabaseService,
    private readonly cdr: ChangeDetectorRef,
    private readonly powerSync: PowerSyncService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.subscription = this.powerSync.connectionStatus$.subscribe(
      (connected) => {
        this.connected = connected;
      }
    );
    if (await this.supabase.getSession()) {
      this.router.navigate(['/lists'])
    }
    this.supabase.authChanges(async (_, session) => {
      this.supabase.setSession(session)
      this.isLoggedIn = !!session?.access_token
      if (session?.access_token) {
        if (!this.powerSync.db.connected) {
          await this.powerSync.setupPowerSync(this.supabase)
        }
        this.router.navigate(['/lists'])
      }
    });
  }

  async signOut() {
    await this.supabase.signOut()
    this.isLoggedIn = false
    this.router.navigate(['/login'])
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
