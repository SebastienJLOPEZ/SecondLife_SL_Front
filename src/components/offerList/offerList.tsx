'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import styles from './offerList.module.css';
import { Offer } from '@/src/types/offer';
import { OfferListOption } from '@/src/types/offer';
import api from '@/src/lib/api';

export default function OfferList({ offers, isPublic, hasBrought }: OfferListOption) {
    const [offerList, setOfferList] = useState<Offer[]>([]);
    const [ratings, setRatings] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        setOfferList(offers);
    }, [offers]);

    const updateNote = async (offerId: string, rating: number) => {
        try {
            const res = await api.put(`/api/offer/${offerId}/note`, { rating });
            console.log('Note mise à jour :', res.data);

        } catch (error) {
            console.error('Erreur lors de la mise à jour de la note :', error);
        }
    };

    const truncateText = (text: string, maxLength: number = 120) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const handleStatusChange = (offerId: string) => {
        // Logique pour changer l'état de l'offre
        console.log('Change status for offer:', offerId);
    };

    const handleEdit = (offerId: string) => {
        // Logique pour éditer l'offre
        console.log('Edit offer:', offerId);
    };

    const handleRating = (offerId: string, rating: number) => {
        setRatings({ ...ratings, [offerId]: rating });
        updateNote(offerId, rating);
        console.log('Rating for offer:', offerId, 'is', rating);
    };

    return (
        <div className={styles.offerListContainer}>
            {isPublic ? (
                offerList.map((offer) => (
                    <Link key={offer._id} href={`/offers/${offer._id}`} className={styles.offerCard}>
                        <div className={styles.offerMainContent}>
                            <h3 className={styles.offerTitle}>{offer.title}</h3>
                            <div className={styles.categoryTypeRow}>
                                <span className={styles.badge}>{offer.category}</span>
                                <span className={styles.badge}>{offer.type}</span>
                            </div>
                            <p className={styles.description}>{truncateText(offer.description)}</p>
                            {offer.demand && <p className={styles.demand}>🔄 Demande : {offer.demand}</p>}
                            {offer.price && <p className={styles.price}>💰 Prix : {offer.price}€</p>}
                        </div>
                        <div className={styles.ownerSection}>
                            <p className={styles.owner}>👤 {offer.owner.name} {offer.owner.surname}</p>
                        </div>
                    </Link>
                ))
            ) : (
                offerList.map((offer) => (
                    <div key={offer._id} className={styles.offerCardPrivate}>
                        <div className={styles.offerMainContent}>
                            <h3 className={styles.offerTitle}>{offer.title}</h3>
                            <div className={styles.categoryTypeRow}>
                                <span className={styles.badge}>{offer.category}</span>
                                <span className={styles.badge}>{offer.type}</span>
                            </div>
                            <p className={styles.description}>{truncateText(offer.description)}</p>
                            {offer.demand && <p className={styles.demand}>🔄 Demande : {offer.demand}</p>}
                            {offer.price && <p className={styles.price}>💰 Prix : {offer.price}€</p>}

                            <p className={styles.status}>Statut : <span className={styles.statusValue}>{offer.status}</span></p>
                        </div>
                        <div className={styles.offerActionsPanel}>
                            {hasBrought ? (
                                <div>
                                    <p>Propriétaire : {offer.owner?.name} {offer.owner?.surname || ''}</p>
                                </div>
                            ) : (
                                offer.buyer && (
                                    <div>
                                        <p>Échangeur : {offer.buyer.name} {offer.buyer.surname}</p>
                                    </div>
                                )
                            )}

                            <div className={styles.ratingSection}>
                                <p className={styles.ratingLabel}>Notation</p>
                                <div className={styles.stars}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            className={`${styles.star} ${ratings[offer._id] >= star ? styles.starActive : ''}`}
                                            onClick={() => handleRating(offer._id, star)}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {offer.status !== 'exchanged' && offer.status !== 'removed' && (
                                <div className={styles.buttonContainer}>
                                    <button onClick={() => handleStatusChange(offer._id)} className={styles.statusButton}>
                                        Modifier l&apos;état
                                    </button>
                                    <button onClick={() => handleEdit(offer._id)} className={styles.editButton}>
                                        Modifier
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}