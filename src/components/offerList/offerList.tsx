'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import styles from './offerList.module.css';
import { Offer } from '@/src/types/offer';
import { OfferListOption } from '@/src/types/offer';

export default function OfferList({ offers, isPublic }: OfferListOption) {
    const [offerList, setOfferList] = useState<Offer[]>([]);

    useEffect(() => {
        setOfferList(offers);
    }, [offers]);

    const handleStatusChange = (offerId: string) => {
        // Logique pour changer l'état de l'offre
        console.log('Change status for offer:', offerId);
    };

    const handleEdit = (offerId: string) => {
        // Logique pour éditer l'offre
        console.log('Edit offer:', offerId);
    };

    return (
        <div className={styles.offerListContainer}>
            {isPublic ? (
                offerList.map((offer) => (
                    <Link key={offer._id} href={`/offers/${offer._id}`} className={styles.offerCard}>
                        <h3>{offer.title}</h3>
                        <p>{offer.description}</p>
                        <p>Catégorie : {offer.category}</p>
                        <p>Type : {offer.type}</p>
                        {offer.price && <p>Prix : ${offer.price}</p>}
                        {offer.demand && <p>Demande : {offer.demand}</p>}
                        <p>Propriétaire : {offer.owner.name} {offer.owner.surname}</p>
                    </Link>
                ))
            ) : (
                offerList.map((offer) => (
                    <div key={offer._id} className={styles.offerCard}>
                        <h3>{offer.title}</h3>
                        <p>{offer.description}</p>
                        <p>Catégorie : {offer.category}</p>
                        <p>Type : {offer.type}</p>
                        {offer.price && <p>Prix : ${offer.price}</p>}
                        {offer.demand && <p>Demande : {offer.demand}</p>}
                        <p>Statut : {offer.status}</p>
                        <div className={styles.buttonContainer}>
                            <button onClick={() => handleStatusChange(offer._id)} className={styles.statusButton}>
                                Modifier l&apos;état
                            </button>
                            <button onClick={() => handleEdit(offer._id)} className={styles.editButton}>
                                Modifier le contenu
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}