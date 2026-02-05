'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './message.module.css';
import api from '@/src/lib/api';
import { Negociation } from '@/src/types/message';

interface MessageProps {
    offerId: string;
    onBack: () => void;
}

export default function Message({ offerId, onBack }: MessageProps) {
    const [negociation, setNegociation] = useState<Negociation | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [currentUserId, setCurrentUserId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [negociation?.messages]);

    useEffect(() => {
        const fetchNegociation = async () => {
            try {
                setIsLoading(true);
                const res = await api.get(`/api/negociation/${offerId}/`);
                setNegociation(res.data.negociation);

                // Récupérer l'ID de l'utilisateur courant depuis le token ou le contexte
                const userRes = await api.get('/api/user/profile');
                setCurrentUserId(userRes.data.data._id);
                console.log('Current user ID:', userRes.data.data._id);
            } catch (error) {
                console.error('Erreur lors de la récupération de la négociation :', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (offerId) {
            fetchNegociation();
        }
    }, [offerId]);

    // Polling pour rafraîchir les messages toutes les 3 secondes
    useEffect(() => {
        if (!offerId) return;

        const refreshMessages = async () => {
            try {
                const res = await api.get(`/api/negociation/${offerId}/`);
                setNegociation(res.data.negociation);
            } catch (error) {
                console.error('Erreur lors du rafraîchissement des messages :', error);
            }
        };

        const interval = setInterval(refreshMessages, 3000); // Rafraîchir toutes les 3 secondes

        return () => clearInterval(interval); // Nettoyer l'interval au démontage
    }, [offerId]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newMessage.trim()) return;

        try {
            await api.put(`/api/negociation/${offerId}/`, {
                message: newMessage
            });

            // Recharger la négociation après l'envoi
            const res = await api.get(`/api/negociation/${offerId}/`);
            setNegociation(res.data.negociation);
            setNewMessage('');
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message :', error);
        }
    };

    const getOtherUser = () => {
        if (!negociation?.messages.length) return null;
        const firstMessage = negociation.messages[0];
        return firstMessage.sender._id === currentUserId 
            ? firstMessage.receiver 
            : firstMessage.sender;
    };

    const otherUser = getOtherUser();

    if (isLoading) {
        return (
            <div className={styles.messageContainer}>
                <div className={styles.loading}>Chargement...</div>
            </div>
        );
    }

    return (
        <div className={styles.messageContainer}>
            {/* Header */}
            <div className={styles.messageHeader}>
                <button className={styles.backButton} onClick={onBack}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M19 12H5M5 12L12 19M5 12L12 5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
                <div className={styles.headerContent}>
                    <div className={styles.offerTitle}>AAAA</div>
                    {otherUser && (
                        <div className={styles.userInfo}>
                            <div className={styles.avatar}>
                                {otherUser.name.charAt(0).toUpperCase()}
                            </div>
                            <div className={styles.userName}>
                                {otherUser.name} {otherUser.surname}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Messages List */}
            <div className={styles.messagesList}>
                {negociation?.messages.map((msg) => {
                    const isCurrentUser = msg.sender._id === currentUserId;
                    return (
                        <div
                            key={msg._id}
                            className={`${styles.messageItem} ${
                                isCurrentUser ? styles.messageSent : styles.messageReceived
                            }`}
                        >
                            <div className={styles.messageBubble}>
                                <p className={styles.messageText}>{msg.content}</p>
                                <span className={styles.messageTime}>
                                    {new Date(msg.timestamp).toLocaleTimeString('fr-FR', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form className={styles.messageForm} onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Écrire un message..."
                    className={styles.messageInput}
                />
                <button
                    type="submit"
                    className={styles.sendButton}
                    disabled={!newMessage.trim()}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </form>
        </div>
    );
}