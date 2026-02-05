'use client';

import { useState, useEffect } from 'react';
import styles from './messages.module.css';
import Message from '@/src/components/message/message';
import MessageList from '@/src/components/messageList/messageList';


export default function MessagePage() {
    const [viewState, setViewState] = useState<'list' | 'conversation'>('list'); // 'list' ou 'conversation'
    const [messageId, setMessageId] = useState<string | null>(null);

    useEffect(() => {
    }, []);

    const handleOpenChat = (offerId: string) => {
        setMessageId(offerId);
        setViewState('conversation');
    };

    const handleBackToList = () => {
        setViewState('list');
        setMessageId(null);
    };

    return (
        <div className={styles.messageContainer}>
            {viewState === 'list' ? (
                <div>
                    <h1 className={styles.title}>Vos Négociations</h1>
                    <div className={styles.messageList}>
                        <MessageList onOpenChat={handleOpenChat} />
                    </div>
                </div>
            ) : (
                <div className={styles.conversation}>
                    <Message offerId={messageId!} onBack={handleBackToList} />
                </div>
            )}
        </div>
    );
}
