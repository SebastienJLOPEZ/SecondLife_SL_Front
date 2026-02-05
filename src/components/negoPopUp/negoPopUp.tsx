'use client';

import { useState } from 'react';
import styles from './negoPopUp.module.css';
import api from '@/src/lib/api';

interface NegoPopUpProps {
    offerId: string;
    offerTitle: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function NegoPopUp({ offerId, offerTitle, onClose, onSuccess }: NegoPopUpProps) {
    const [view, setView] = useState<'initial' | 'custom-message'>('initial');
    const [customMessage, setCustomMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDirectResponse = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            await api.put(`/api/offer/${offerId}/direct-response`, {
            });

            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Erreur lors de la réponse directe:', err);
            setError(err.response?.data?.message || 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAutoMessage = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const message = `Bonjour, je suis intéressé(e) par votre offre "${offerTitle}". Pourriez-vous me donner plus d'informations ?`;
            
            await api.post(`/api/negociation/${offerId}/`, {
                message: message
            });

            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Erreur lors de l\'envoi du message automatique:', err);
            setError(err.response?.data?.message || 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCustomMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!customMessage.trim()) {
            setError('Veuillez entrer un message');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            
            await api.post(`/api/negociation/${offerId}/`, {
                message: customMessage
            });

            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Erreur lors de l\'envoi du message personnalisé:', err);
            setError(err.response?.data?.message || 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.popupContainer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.popupHeader}>
                    <h2>{view === 'initial' ? 'Répondre à l\'offre' : 'Écrire un message'}</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M18 6L6 18M6 6L18 18"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>

                <div className={styles.popupContent}>
                    {error && (
                        <div className={styles.error}>
                            {error}
                        </div>
                    )}

                    {view === 'initial' ? (
                        <div className={styles.optionsContainer}>
                            <p className={styles.description}>
                                Comment souhaitez-vous répondre à cette offre ?
                            </p>

                            <button
                                className={styles.optionButton}
                                onClick={handleDirectResponse}
                                disabled={isLoading}
                            >
                                <div className={styles.optionIcon}>✅</div>
                                <div className={styles.optionContent}>
                                    <h3>Répondre directement</h3>
                                    <p>Accepter l&apos;offre telle qu&apos;elle est proposée</p>
                                </div>
                            </button>

                            <button
                                className={styles.optionButton}
                                onClick={handleAutoMessage}
                                disabled={isLoading}
                            >
                                <div className={styles.optionIcon}>💬</div>
                                <div className={styles.optionContent}>
                                    <h3>Message automatique</h3>
                                    <p>Démarrer une négociation avec un message prédéfini</p>
                                </div>
                            </button>

                            <button
                                className={styles.optionButton}
                                onClick={() => setView('custom-message')}
                                disabled={isLoading}
                            >
                                <div className={styles.optionIcon}>✏️</div>
                                <div className={styles.optionContent}>
                                    <h3>Message personnalisé</h3>
                                    <p>Écrire votre propre message de négociation</p>
                                </div>
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleCustomMessage} className={styles.messageForm}>
                            <textarea
                                className={styles.messageInput}
                                value={customMessage}
                                onChange={(e) => setCustomMessage(e.target.value)}
                                placeholder="Écrivez votre message ici..."
                                rows={5}
                                disabled={isLoading}
                            />
                            
                            <div className={styles.formActions}>
                                <button
                                    type="button"
                                    className={styles.cancelButton}
                                    onClick={() => setView('initial')}
                                    disabled={isLoading}
                                >
                                    Retour
                                </button>
                                <button
                                    type="submit"
                                    className={styles.submitButton}
                                    disabled={isLoading || !customMessage.trim()}
                                >
                                    {isLoading ? 'Envoi...' : 'Envoyer'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
