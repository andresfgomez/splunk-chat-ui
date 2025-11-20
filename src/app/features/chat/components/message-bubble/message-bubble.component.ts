import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownPipe } from '../../../../shared/pipes/markdown.pipe';

export interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
  meta?: {
    timeTaken?: string;
  };
}

@Component({
  selector: 'app-message-bubble',
  standalone: true,
  imports: [CommonModule, MarkdownPipe],
  template: `
    <div class="message-row" [ngClass]="{'user-row': message.role === 'user'}">
      <!-- Avatar (Agent) -->
      <div *ngIf="message.role === 'agent'" class="avatar agent-avatar">
        <span class="avatar-text">AI</span>
      </div>

      <div class="message-content-wrapper">
        <!-- Message Content -->
        <div 
          class="message-bubble"
          [ngClass]="{
            'user-bubble': message.role === 'user',
            'agent-bubble': message.role === 'agent'
          }"
        >
          <div *ngIf="message.role === 'user'">{{ message.content }}</div>
          <div *ngIf="message.role === 'agent'" [innerHTML]="message.content | markdown" class="markdown-content"></div>
        </div>

        <!-- Metadata -->
        <div class="metadata" [ngClass]="{'metadata-end': message.role === 'user'}">
          <span class="timestamp">{{ message.timestamp | date:'shortTime' }}</span>
          <span *ngIf="message.meta?.timeTaken" class="time-taken">
            {{ message.meta?.timeTaken }}
          </span>
        </div>
      </div>

      <!-- Avatar (User) -->
      <div *ngIf="message.role === 'user'" class="avatar user-avatar">
        <span class="avatar-text">U</span>
      </div>
    </div>
  `,
  styles: [`
    .message-row {
      display: flex;
      width: 100%;
      margin-bottom: 1.5rem;
    }

    .user-row {
      justify-content: flex-end;
    }

    .avatar {
      width: 2rem;
      height: 2rem;
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 0.25rem;
    }

    .agent-avatar {
      background: linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary));
      margin-right: 0.75rem;
      box-shadow: var(--shadow-md);
    }

    .user-avatar {
      background-color: var(--color-bg-tertiary);
      margin-left: 0.75rem;
    }

    .avatar-text {
      font-size: 0.75rem;
      font-weight: bold;
      color: white;
    }

    .message-content-wrapper {
      max-width: 85%;
    }

    @media (min-width: 768px) {
      .message-content-wrapper {
        max-width: 75%;
      }
    }

    .message-bubble {
      padding: 1rem;
      border-radius: 1rem;
      font-size: 0.875rem;
      line-height: 1.6;
      box-shadow: var(--shadow-sm);
    }

    .user-bubble {
      background-color: var(--color-accent-primary);
      color: white;
      border-bottom-right-radius: 0.125rem;
    }

    .agent-bubble {
      background-color: var(--color-bg-secondary);
      color: var(--color-text-secondary);
      border: 1px solid var(--color-border);
      border-bottom-left-radius: 0.125rem;
    }

    .metadata {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.25rem;
      padding: 0 0.25rem;
    }

    .metadata-end {
      justify-content: flex-end;
    }

    .timestamp {
      font-size: 0.625rem;
      color: var(--color-text-muted);
    }

    .time-taken {
      font-size: 0.625rem;
      color: var(--color-accent-primary);
      background-color: rgba(59, 130, 246, 0.1);
      padding: 0.125rem 0.375rem;
      border-radius: var(--radius-full);
    }

    /* Markdown Styles */
    :host ::ng-deep .markdown-content p { margin-bottom: 0.5em; }
    :host ::ng-deep .markdown-content p:last-child { margin-bottom: 0; }
    :host ::ng-deep .markdown-content pre { background: #0f172a; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 0.5rem 0; border: 1px solid #334155; }
    :host ::ng-deep .markdown-content code { font-family: monospace; background: rgba(255,255,255,0.1); padding: 0.1rem 0.3rem; border-radius: 0.25rem; }
    :host ::ng-deep .markdown-content pre code { background: transparent; padding: 0; }
    :host ::ng-deep .markdown-content ul, :host ::ng-deep .markdown-content ol { margin-left: 1.5rem; margin-bottom: 0.5em; }
    :host ::ng-deep .markdown-content a { color: #60a5fa; text-decoration: underline; }
  `]
})
export class MessageBubbleComponent {
  @Input({ required: true }) message!: Message;
}
