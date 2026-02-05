'use client';

import { useState, useEffect} from 'react';
import styles from './my-offers.module.css';
import { Offer } from '@/src/types/offer';
import OfferList from '@/src/components/offerList/offerList';
import api from '@/src/lib/api';

export default function MyOffers() {
    const [offersOwner, setOffersOwner] = useState<Offer[]>([]);
    const [offersBuyer, setOffersBuyer] = useState<Offer[]>([]);

    useEffect(() => {
        const fetchMyOffers = async () => {
            try {
                const res = await api.get('/api/offer/my-offers/');
                setOffersOwner(res.data.data.owned);
                setOffersBuyer(res.data.data.bought);
            } catch (error) {
                console.error('Erreur lors de la récupération de mes offres :', error);
            }
        };
        fetchMyOffers();
    }, []);

    

    return (
        <div className={styles.myOffersContainer}>
            <h1>Mes Offres</h1>
            <OfferList offers={offersOwner} isPublic={false} hasBrought={false} />
            <h1>Offres auxquelles j&apos;ai répondu</h1>
            <OfferList offers={offersBuyer} isPublic={false} hasBrought={true} />
        </div>
    )
}

