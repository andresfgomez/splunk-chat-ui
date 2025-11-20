import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService, ChatMessage } from '../../../../core/services/chat.service';
import { MessageBubbleComponent, Message } from '../message-bubble/message-bubble.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [CommonModule, MessageBubbleComponent],
  template: `
    <div class="list-container" #scrollContainer>
      <div class="list-content">
        
        <!-- Welcome Message if empty -->
        <div *ngIf="messages.length === 0" class="welcome-message">
          <div class="welcome-icon">
            <span class="emoji">👋</span>
          </div>
          <h2 class="welcome-title">Welcome to Splunk Chat</h2>
          <p class="welcome-text">Ask me anything about your logs, metrics, or traces. I can help you find insights and troubleshoot issues.</p>
        </div>

        <!-- Messages -->
        <app-message-bubble 
          *ngFor="let msg of messages" 
          [message]="msg">
        </app-message-bubble>

        <!-- Loading Indicator -->
        <div *ngIf="isLoading" class="loading-row">
          <div class="avatar agent-avatar">
             <span class="avatar-text">AI</span>
          </div>
          <div class="loading-bubble">
            <div class="dot" style="animation-delay: 0ms"></div>
            <div class="dot" style="animation-delay: 150ms"></div>
            <div class="dot" style="animation-delay: 300ms"></div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .list-container {
      height: 100%;
      overflow-y: auto;
      padding: var(--spacing-md);
      scroll-behavior: smooth;
    }

    .list-content {
      max-width: 56rem; /* max-w-4xl */
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      min-height: 100%;
      padding-bottom: var(--spacing-md);
    }

    .welcome-message {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      opacity: 0.5;
      margin-bottom: 3rem;
    }

    .welcome-icon {
      width: 4rem;
      height: 4rem;
      border-radius: var(--radius-full);
      background-color: var(--color-bg-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: var(--spacing-md);
    }

    .emoji {
      font-size: 1.5rem;
    }

    .welcome-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: var(--spacing-sm);
    }

    .welcome-text {
      font-size: 0.875rem;
      max-width: 28rem;
    }

    .loading-row {
      display: flex;
      width: 100%;
      margin-bottom: 1.5rem;
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

    .avatar-text {
      font-size: 0.75rem;
      font-weight: bold;
      color: white;
    }

    .loading-bubble {
      background-color: var(--color-bg-secondary);
      padding: 1rem;
      border-radius: 1rem;
      border-bottom-left-radius: 0.125rem;
      border: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .dot {
      width: 0.5rem;
      height: 0.5rem;
      background-color: var(--color-text-muted);
      border-radius: var(--radius-full);
      animation: bounce 1s infinite;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-25%); }
    }
  `]
})
export class MessageListComponent implements OnInit, AfterViewChecked {
  messages: Message[] = [];
  isLoading = false;
  private subscription: Subscription = new Subscription();
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    // Subscribe to incoming messages from WebSocket
    this.subscription.add(
      this.chatService.messages$.subscribe((response: ChatMessage) => {
        this.isLoading = false;
        this.addMessage({
          id: Date.now().toString(),
          role: 'agent',
          content: response.agentResponse,
          timestamp: new Date(),
          meta: { timeTaken: response.timeTaken }
        });
      })
    );

    // Intercept outgoing messages to display them immediately
    // Note: In a real app, we might want a separate Subject for outgoing messages or state management
    const originalSendMessage = this.chatService.sendMessage.bind(this.chatService);
    this.chatService.sendMessage = (query: string) => {
      this.addMessage({
        id: Date.now().toString(),
        role: 'user',
        content: query,
        timestamp: new Date()
      });
      this.isLoading = true;
      originalSendMessage(query);
      this.scrollToBottom();
    };
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private addMessage(msg: Message): void {
    this.messages.push(msg);
    this.scrollToBottom();
  }

  public clearMessages(): void {
    this.messages = [];
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
}
