'use client';

import { useState, useEffect, use } from 'react';
import styles from './forum.module.css';
import { ThreadForum } from '@/src/types/thread';
import api from '@/src/lib/api';
import Link from 'next/link';

export default function ForumPage( { params }: { params: Promise<{ id: string }> } ) {
    const [thread, setThread] = useState<ThreadForum | null>(null);
    const [message, setMessage] = useState<string>('');
    const { id } = use(params);
    const isConnected = !!localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchThread = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/thread/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                const res = await response.json();
                if (res.success) {
                    setThread(res.thread);
                } else {
                    console.error('Failed to fetch thread:', res.message);
                }
            } catch (error) {
                console.error('Error fetching thread:', error);
            }
        };

        fetchThread();
    }, [id]);

    const handleSentMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = api.put(`/api/thread/${id}/message`, {
                content: message
            });

            const data = await res;
            if (data.data.success) {
                window.location.reload();
            } else {
                console.error('Failed to send message:', data.data.message);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    if (!thread) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className={styles.formContainer}>
            <div className={styles.firstMessageContainer}>
                    <div className={styles.firstMessageInfo}>
                        <p>{thread.poster.name} {thread.poster.surname}</p>
                        <small>Auteur</small>
                    </div>
                    <div className={styles.firstMessageContent}>
                        <h1>{thread.subject}</h1>
                        <small>{new Date(thread.firstMessage.timestamp).toLocaleString()}</small>
                        <p>{thread.firstMessage.content}</p>
                    </div>
            </div>
            <div className={styles.messages}>
                {thread.messages.map((message, index) => (
                    <div key={index} className={styles.message}>
                        <div className={styles.senderInfo}>
                            <p>{message.sender.name} {message.sender.surname}</p>
                            <small>{new Date(message.timestamp).toLocaleString()}</small>
                        </div>
                        <div className={styles.messageContent}>
                            <h3>{message.title}</h3>
                            <p>{message.content}</p>
                        </div>
                    </div>
                ))}
            </div>
            {isConnected ? (
                <div className={styles.respondSection}>
                    <form onSubmit={handleSentMessage}>
                        <textarea placeholder="Votre message..." required value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                        <button type="submit">Envoyer</button>
                    </form>
                </div>
            ) : null}
        </div>
        </>
        
    );
}