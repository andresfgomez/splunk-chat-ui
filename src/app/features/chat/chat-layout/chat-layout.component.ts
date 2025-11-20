import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageListComponent } from '../components/message-list/message-list.component';
import { MessageInputComponent } from '../components/message-input/message-input.component';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-chat-layout',
  standalone: true,
  imports: [CommonModule, MessageListComponent, MessageInputComponent],
  template: `
    <div class="app-container">
      <!-- Sidebar -->
      <aside class="sidebar" [class.collapsed]="isCollapsed">
        <div class="sidebar-header">
          <button class="menu-toggle" (click)="toggleSidebar()">
            <span class="icon">☰</span>
          </button>
          <div class="logo-container" *ngIf="!isCollapsed">
             <span class="logo-text">Splunk Chat</span>
          </div>
        </div>
        
        <div class="new-chat-container">
            <button class="new-chat-btn" (click)="startNewChat()" [title]="isCollapsed ? 'New Chat' : ''">
                <span class="plus-icon">+</span>
                <span class="btn-text" *ngIf="!isCollapsed">New Chat</span>
            </button>
        </div>
        
        <div class="sidebar-content">
          <div *ngIf="!isCollapsed">
            <div class="section-title">Recent Chats</div>
            <!-- Mock History Items -->
            <button class="history-item">
              Error analysis 500
            </button>
            <button class="history-item">
              Traffic spike yesterday
            </button>
          </div>
        </div>

        <div class="sidebar-footer">
          <!-- Settings Button -->
          <button class="settings-btn" [title]="isCollapsed ? 'Settings' : ''">
            <span>⚙️</span><span *ngIf="!isCollapsed"> Settings</span>
          </button>
          
          <!-- User Profile Section -->
          <div class="user-profile">
            <button class="profile-btn" [title]="isCollapsed ? 'User Profile' : ''">
              <div class="avatar-circle">
                <span class="avatar-initials">U</span>
              </div>
              <div class="user-info" *ngIf="!isCollapsed">
                <div class="user-name">User</div>
                <div class="user-email">user@example.com</div>
              </div>
            </button>
            <button class="logout-btn" (click)="logout()" [title]="isCollapsed ? 'Logout' : 'Logout'">
              <span class="logout-icon" *ngIf="!isCollapsed">🚪</span>
              <span class="logout-icon" *ngIf="isCollapsed">↩️</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Chat Area -->
      <main class="main-area">
        <!-- Header (Mobile only) -->
        <header class="mobile-header">
          <span class="logo-text">Splunk Chat</span>
          <button class="menu-btn">☰</button>
        </header>

        <!-- Messages Area -->
        <div class="messages-container">
           <app-message-list class="message-list-wrapper"></app-message-list>
        </div>

        <!-- Input Area -->
        <div class="input-container">
           <app-message-input></app-message-input>
           <div class="disclaimer">
             AI can make mistakes. Please verify important information.
           </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      background-color: var(--color-bg-primary);
      color: var(--color-text-primary);
    }

    .app-container {
      display: flex;
      height: 100%;
      width: 100%;
    }

    /* Sidebar */
    .sidebar {
      width: 260px;
      background-color: var(--color-bg-secondary);
      border-right: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      transition: width 0.3s ease;
    }

    .sidebar.collapsed {
      width: 72px;
    }

    .sidebar-header {
      padding: var(--spacing-md);
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      height: 64px; /* Fixed height for consistency */
    }

    .menu-toggle {
      background: transparent;
      border: none;
      color: var(--color-text-muted);
      cursor: pointer;
      padding: 8px;
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;
    }

    .menu-toggle:hover {
        background-color: var(--color-bg-tertiary);
        color: var(--color-text-primary);
    }

    .menu-toggle .icon {
        font-size: 1.25rem;
    }

    .logo-container {
        white-space: nowrap;
        overflow: hidden;
        opacity: 1;
        transition: opacity 0.2s;
    }

    .logo-text {
      font-weight: 600;
      font-size: var(--font-size-lg);
    }

    .new-chat-container {
        padding: 0 var(--spacing-md);
        margin-bottom: var(--spacing-sm);
        display: flex;
        justify-content: center; /* Center button in collapsed mode */
    }

    .new-chat-btn {
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: flex-start; /* Default left align */
        gap: var(--spacing-sm);
        padding: 0 var(--spacing-md);
        background-color: var(--color-accent-primary);
        color: white;
        border: none;
        border-radius: var(--radius-sm); /* Full radius for icon-only look if desired, or keep sm */
        font-size: var(--font-size-sm);
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        white-space: nowrap;
        overflow: hidden;
    }

    .sidebar.collapsed .new-chat-btn {
        width: 40px; /* Square button */
        padding: 0;
        justify-content: center;
        border-radius: var(--radius-full); /* Circle in collapsed mode */
    }

    .new-chat-btn:hover {
        background-color: var(--color-accent-secondary);
    }

    .plus-icon {
        font-size: 1.2em;
        line-height: 1;
        flex-shrink: 0;
    }

    .sidebar-content {
      flex: 1;
      overflow-y: auto;
      padding: var(--spacing-sm);
    }

    .section-title {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: var(--spacing-sm);
      padding: 0 var(--spacing-sm);
    }

    .history-item {
      width: 100%;
      text-align: left;
      padding: var(--spacing-sm);
      border-radius: var(--radius-sm);
      background: transparent;
      border: none;
      color: var(--color-text-secondary);
      font-size: var(--font-size-sm);
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: background-color 0.2s;
    }

    .history-item:hover {
      background-color: var(--color-bg-tertiary);
      color: var(--color-text-primary);
    }

    .sidebar-footer {
      padding: var(--spacing-md);
      border-top: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    /* User Profile Section */
    .user-profile {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm);
      background-color: rgba(255, 255, 255, 0.03);
      border-radius: var(--radius-md);
      transition: background-color 0.2s;
    }

    .user-profile:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }

    .profile-btn {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      background: transparent;
      border: none;
      cursor: pointer;
      flex: 1;
      padding: 0;
      color: var(--color-text-primary);
    }

    .avatar-circle {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-full);
      background: linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary));
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: var(--shadow-md);
    }

    .avatar-initials {
      font-size: 0.875rem;
      font-weight: 600;
      color: white;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      overflow: hidden;
    }

    .user-name {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 140px;
    }

    .user-email {
      font-size: 0.75rem;
      color: var(--color-text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 140px;
    }

    .logout-btn {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-sm);
      background: transparent;
      border: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      flex-shrink: 0;
      font-size: 1rem;
    }

    .logout-btn:hover {
      background-color: rgba(239, 68, 68, 0.1);
      border-color: rgba(239, 68, 68, 0.3);
    }

    .sidebar.collapsed .user-profile {
      justify-content: center;
      padding: var(--spacing-sm);
    }

    .sidebar.collapsed .logout-btn {
      width: 36px;
      height: 36px;
    }

    /* Settings Button */

    .settings-btn {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: var(--spacing-sm);
      background: transparent;
      border: none;
      color: var(--color-text-muted);
      font-size: var(--font-size-sm);
      cursor: pointer;
      transition: color 0.2s;
      width: 100%;
      padding: var(--spacing-sm);
      border-radius: var(--radius-sm);
    }

    .sidebar.collapsed .settings-btn {
      justify-content: center;
      padding: var(--spacing-sm);
    }

    .settings-btn:hover {
      color: var(--color-text-primary);
      background-color: var(--color-bg-tertiary);
    }

    /* Main Area */
    .main-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
      background-color: var(--color-bg-primary);
    }

    .mobile-header {
      height: 56px;
      border-bottom: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--spacing-md);
      background-color: rgba(30, 41, 59, 0.8);
      backdrop-filter: blur(8px);
    }

    .menu-btn {
      background: transparent;
      border: none;
      color: var(--color-text-muted);
      font-size: 1.5rem;
      cursor: pointer;
    }

    .messages-container {
      flex: 1;
      overflow: hidden;
      position: relative;
    }

    .message-list-wrapper {
      height: 100%;
      width: 100%;
      display: block;
    }

    .input-container {
      padding: var(--spacing-md);
      padding-bottom: var(--spacing-xl);
      width: 100%;
      max-width: 900px;
      margin: 0 auto;
    }

    .disclaimer {
      text-align: center;
      font-size: 0.75rem;
      color: var(--color-text-muted);
      margin-top: var(--spacing-sm);
    }

    @media (min-width: 768px) {
      .mobile-header {
        display: none;
      }
    }

    @media (max-width: 767px) {
      .sidebar {
        position: absolute;
        z-index: 50;
        height: 100%;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
      }
      
      .sidebar.open {
        transform: translateX(0);
        display: flex; /* Ensure it's visible when open */
      }
    }
  `]
})
export class ChatLayoutComponent {
  @ViewChild(MessageListComponent) messageListComponent!: MessageListComponent;
  isCollapsed = false;

  constructor(private authService: AuthService) { }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  startNewChat(): void {
    this.messageListComponent.clearMessages();
  }

  logout(): void {
    this.authService.logout();
  }
}
