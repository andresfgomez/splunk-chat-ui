import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../../core/services/chat.service';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="input-wrapper">
      <textarea
        #textarea
        [(ngModel)]="message"
        (keydown.enter)="onEnter($event)"
        placeholder="Ask Splunk about your data..."
        class="message-textarea"
        rows="1"
        (input)="adjustHeight()"
      ></textarea>
      
      <button 
        (click)="sendMessage()"
        [disabled]="!message.trim()"
        class="send-btn"
        aria-label="Send message">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
          <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
        </svg>
      </button>
    </div>
  `,
  styles: [`
    .input-wrapper {
      position: relative;
      background-color: var(--color-bg-secondary);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-md);
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .input-wrapper:focus-within {
      border-color: var(--color-accent-primary);
      box-shadow: 0 0 0 1px var(--color-accent-primary);
    }

    .message-textarea {
      width: 100%;
      background: transparent;
      color: var(--color-text-primary);
      padding: var(--spacing-md);
      padding-right: 3.5rem; /* Space for button */
      border-radius: var(--radius-lg);
      resize: none;
      border: none;
      outline: none;
      max-height: 12rem;
      overflow-y: auto;
      font-family: inherit;
      font-size: var(--font-size-base);
      line-height: 1.5;
      min-height: 56px;
    }

    .message-textarea::placeholder {
      color: var(--color-text-muted);
    }

    .send-btn {
      position: absolute;
      right: 0.5rem;
      bottom: 0.5rem;
      padding: 0.5rem;
      border-radius: var(--radius-md);
      background-color: var(--color-accent-primary);
      color: white;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s, opacity 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .send-btn:hover:not(:disabled) {
      background-color: var(--color-accent-secondary);
    }

    .send-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background-color: var(--color-bg-tertiary);
    }

    .icon {
      width: 20px;
      height: 20px;
    }
  `]
})
export class MessageInputComponent {
  message = '';
  @ViewChild('textarea') textarea!: ElementRef<HTMLTextAreaElement>;

  constructor(private chatService: ChatService) { }

  onEnter(event: any): void {
    if (!event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage(): void {
    if (this.message.trim()) {
      this.chatService.sendMessage(this.message);
      this.message = '';
      this.adjustHeight();
    }
  }

  adjustHeight(): void {
    const el = this.textarea.nativeElement;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 192) + 'px'; // Max 12rem (approx 192px)
  }
}
