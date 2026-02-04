export interface Thread {
    _id: string;
    subject: string;
    poster: Poster;
    messages: [{
        senders: Poster;
        content: string;
        timestamp: string;
    }];
    createdAt: string;
    updatedAt: string;
    status: string;
}

interface Poster {
    _id: string;
    name: string;
    surname: string;
}

// When fetching a single thread with messages
export interface ThreadForum { 
    _id: string;
    subject: string;
    poster: Poster;
    firstMessage: {
        senders: Poster;
        content: string;
        citation: boolean;
        citedMessage?: string;
        timestamp: string;
    };
    messages: [{
        sender: Poster;
        title: string;
        content: string;
        citation: boolean;
        citedMessage?: string;
        timestamp: string;
    }];
    createdAt: string;
    updatedAt: string;
    status: string;
}