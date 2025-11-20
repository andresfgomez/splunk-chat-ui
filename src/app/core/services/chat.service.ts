import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subject } from 'rxjs';
import { map, retry, catchError } from 'rxjs/operators';

export interface ChatMessage {
    agentResponse: string;
    timeTaken: string;
}

export interface UserMessage {
    query: string;
    // Add other fields if needed, e.g., filters, timeRange
}

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private socket$: WebSocketSubject<any>;
    private messagesSubject = new Subject<ChatMessage>();
    public messages$ = this.messagesSubject.asObservable();

    // Configuration - could be moved to environment
    private readonly WS_ENDPOINT = 'ws://localhost:8000/chat';

    constructor() {
        this.socket$ = webSocket({
            url: this.WS_ENDPOINT,
            openObserver: {
                next: () => console.log('WebSocket connection established')
            },
            closeObserver: {
                next: () => console.log('WebSocket connection closed')
            }
        });

        this.socket$.pipe(
            retry({ delay: 3000 }), // Auto-reconnect
            catchError(err => {
                console.error('WebSocket error:', err);
                throw err;
            })
        ).subscribe({
            next: (msg) => this.messagesSubject.next(msg),
            error: (err) => console.error('WebSocket error:', err),
            complete: () => console.warn('WebSocket connection complete')
        });
    }

    sendMessage(query: string): void {
        const message: UserMessage = { query };
        this.socket$.next(message);
    }

    close(): void {
        this.socket$.complete();
    }
}
