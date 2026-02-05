'use client';

import { useState, useEffect } from 'react';
import styles from './messageList.module.css';
import { Negociation } from '@/src/types/message';
import api from '@/src/lib/api';

export default function MessageList({ onOpenChat }: { onOpenChat: (offerId: string) => void }) {
    const [negociations, setNegociations] = useState<Negociation[]>([]);

    useEffect(() => {
        const fetchNegociations = async () => {
            try {
                const res = await api.get('/api/negociation/user/');
                setNegociations(res.data.negociations);
            } catch (error) {
                console.error('Erreur lors de la récupération des négociations :', error);
            }
        };

        // Appel initial au montage du composant
        fetchNegociations();

        // Puis rafraîchissement toutes les 3 secondes
        const interval = setInterval(fetchNegociations, 3000);

        return () => clearInterval(interval); // Nettoyer l'interval au démontage
    }, []);

    return (
        <div className={styles.messageListContainer}>
            <div className={styles.messageList}>
                {negociations.length === 0 ? (
                    <p className={styles.emptyState}>Aucune négociation en cours.</p>
                ) : (
                    negociations.map((negociation) => {
                        const productId = typeof negociation.productRef === 'string' 
                            ? negociation.productRef 
                            : negociation.productRef._id;
                        const lastMessage = negociation.messages[negociation.messages.length - 1];
                        const productTitle = typeof negociation.productRef === 'object' 
                            ? negociation.productRef.title 
                            : 'Produit';
                        
                        return (
                            <div 
                                key={negociation._id} 
                                className={styles.negociationItem} 
                                onClick={() => onOpenChat(productId)}
                            >
                                <div className={styles.avatar}>
                                    📦
                                </div>
                                <div className={styles.content}>
                                    <div className={styles.header}>
                                        <h3 className={styles.productTitle}>{productTitle}</h3>
                                    </div>
                                    <p className={styles.lastMessage}>{lastMessage.content}</p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}