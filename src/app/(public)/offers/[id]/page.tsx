'use client';

import { useState, useEffect, use } from 'react';
import styles from './offer.module.css';
import { Offer } from '@/src/types/offer';
import NegoPopUp from '@/src/components/negoPopUp/negoPopUp';

export default function OfferPage( { params }: { params: Promise<{ id: string }> } ) {
    const [offer, setOffer] = useState<Offer | null>(null);
    const [showResponsePopup, setShowResponsePopup] = useState(false);
    const { id } = use(params);

    useEffect(() => {
        const fetchOffer = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/offer/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                const data = await res.json();
                if (res.ok) {
                    setOffer(data.data);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'offre :', error);
            }
        };

        fetchOffer();
    }, [id]);

    const handleResponseSuccess = () => {
        // Afficher un message de succès ou rediriger vers la page des messages
        alert('Votre message a été envoyé avec succès !');
        // Optionnel : rediriger vers les messages
        // router.push('/messages');
    };

    return (
        <div className={styles.offerContainer}>
            {offer ? (
                <>
                    <div className={styles.offerContent}>
                        <h1 className={styles.offerTitle}>{offer.title}</h1>
                        <div className={styles.offerMeta}>
                            <span className={styles.offerType}>{offer.type}</span>
                            <span className={styles.offerCategory}>{offer.category}</span>
                        </div>
                        <p className={styles.offerDescription}>{offer.description}</p>
                        {offer.price && <p className={styles.offerPrice}>Prix : ${offer.price}</p>}
                        {offer.demand && <p className={styles.offerDemand}>Demande : {offer.demand}</p>}
                    </div>
                    <div className={styles.offerOwner}>
                        <div className={styles.ownerInfo}>
                            <h3>Propriétaire</h3>
                            <p>{offer.owner.name} {offer.owner.surname}</p>
                        </div>
                        <button 
                            className={styles.contactButton}
                            onClick={() => setShowResponsePopup(true)}
                        >
                            Répondre à l&apos;offre
                        </button>
                    </div>

                    {showResponsePopup && (
                        <NegoPopUp
                            offerId={id}
                            offerTitle={offer.title}
                            onClose={() => setShowResponsePopup(false)}
                            onSuccess={handleResponseSuccess}
                        />
                    )}
                </>
            ) : (
                <p>Chargement de l&apos;offre...</p>
            )}
        </div>
    );
}

