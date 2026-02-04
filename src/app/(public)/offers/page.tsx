'use client';

import OfferList from '@/src/components/offerList/offerList';
import { useState, useEffect } from 'react';
import styles from './offerlist.module.css';
// import Link from 'next/link';
import { Category } from '@/src/types/category';
import { Offer } from '@/src/types/offer';
import api from '@/src/lib/api';

export default function  OfferListPage() {
    // const [region, setRegion] = useState<string>('');
    // const [department, setDepartment] = useState<string>('');
    // const [city, setCity] = useState<string>('');
    // Will correct this section later, need to correctly input location for offers
    const [category, setCategory] = useState<string>('');
    const [types, setTypes] = useState<string[]>([]);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [pagination, setPagination] = useState<{ page: number; limit: number; total: number; pages: number }>({ page: 1, limit: 10, total: 0, pages: 0 });
    const [hasFilters, setHasFilters] = useState<boolean>(false);

    const isPublic = true; // Always true for this page

    const fetchOffers = async (page: number, filters?: { category?: string; types?: string[] }) => {
        const isConnected = !!localStorage.getItem('accessToken');

        try {
            let res;
            const payload = new URLSearchParams ({
                page: page.toString(),
                limit: '10',
                ...(filters?.category && { category: filters.category }),
                ...(filters?.types && { types: filters.types.join(',') })
            });

            console.log('Fetching offers with payload:', payload.toString());

            if (isConnected) {
                const endpoint = filters && (filters.category || filters.types) ? '/api/offer/search' : '/api/offer/list';
                const response = await api.get(endpoint, { params: payload });
                res = response.data;
            } else {
                const endpoint = filters && (filters.category || filters.types) ? '/api/offer/search' : '/api/offer/list';
                const params = payload;

                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}?${params.toString()}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                res = await response.json();
            }

            if (res.success) {
                console.log('Offers fetched successfully:', res);
                setOffers(res.data);
                setPagination(res.pagination);
            }
        } catch (error) {
            console.error('Error fetching offers:', error);
        }
    };

    useEffect(() => {
        const loadOffers = async () => {
            await fetchOffers(1);
        };
        loadOffers();
    }, []);

    const handleFilterSetting = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log('types:', types);

        const filters = {
            category: category !== "none" ? category : undefined,
            types: types.length > 0 ? types : undefined
        };

        setHasFilters(!!(filters.category || filters.types));
        fetchOffers(1, filters);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > pagination.pages) return;

        console.log('types:', types);

        const filters = hasFilters ? {
            category: category !== "none" ? category : undefined,
            types: types.length > 0 ? types : undefined
        } : undefined;

        fetchOffers(newPage, filters);
    };

    return (
        <div className={styles.offerPageContainer}>
            <div className={styles.filterContainer}>
                <form action="">
                    <label htmlFor="titre"></label>
                    <input type="text" id="titre" name="titre" placeholder="Titre de l'offre" />
                    <label htmlFor="category">Catégorie :</label>
                    <select id="category" name="category" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
                        <option value={Category.none}>Toutes</option>
                        {Object.entries(Category)
                            .filter(([key]) => key !== 'none')
                            .map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                            ))
                        }
                    </select>
                    <label>Type d&apos;offre</label>
                    <div className={styles.radioGroup}>
                        <label>
                        <input type="checkbox" value="troc" checked={types.includes('troc')} onChange={(e) => {
                            if (e.target.checked) {
                                setTypes([...types, 'troc']);
                            } else {
                                setTypes(types.filter(t => t !== 'troc'));
                            }
                        }} />
                            Troc
                        </label>
                        <label>
                        <input type="checkbox" value="vente" checked={types.includes('vente')} onChange={(e) => {
                            if (e.target.checked) {
                                setTypes([...types, 'vente']);
                            } else {
                                setTypes(types.filter(t => t !== 'vente'));
                            }
                        }} />
                            Vente
                        </label>
                        <label>
                        <input type="checkbox" value="don" checked={types.includes('don')} onChange={(e) => {
                            if (e.target.checked) {
                                setTypes([...types, 'don']);
                            } else {
                                setTypes(types.filter(t => t !== 'don'));
                            }
                        }} />
                            Don
                        </label>
                </div>
                    <button type="submit" onClick={handleFilterSetting}>Appliquer les filtres</button>
                </form>
            </div>
            <h1>Liste des offres</h1>
            <OfferList offers={offers} isPublic={isPublic} />

            {pagination.pages > 1 && (
                <div className={styles.paginationContainer}>
                    <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className={styles.paginationButton}
                    >
                        Précédent
                    </button>
                    <span className={styles.paginationInfo}>
                        Page {pagination.page} sur {pagination.pages} ({pagination.total} offres)
                    </span>
                    <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.pages}
                        className={styles.paginationButton}
                    >
                        Suivant
                    </button>
                </div>
            )}
        </div>
    );
}


