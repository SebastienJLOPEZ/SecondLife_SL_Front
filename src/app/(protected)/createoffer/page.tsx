'use client'

// import Link from 'next/link';
import { useState } from 'react';
import api from '@/src/lib/api';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './createoffer.module.css';

enum Category {
    electronique = 'Électronique',
    mobilier = 'Mobilier',
    vetements = 'Vêtements',
    livres = 'Livres',
    autres = 'Autres',
}

export default function CreateOfferPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState<FileList | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageCount, setImageCount] = useState(0);
    const [category, setCategory] = useState<Category | ''>('');
    const [type, setType] = useState<'troc' | 'don' | 'vente'>('troc');
    const [demand, setDemand] = useState('aucune');
    const [price,  setPrice] = useState<number | ''>('');
    const [isNegotiable, setIsNegotiable] = useState(false);

    const router = useRouter();

    const handleCreateOffer = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !description || !category || !type || (type === 'vente' && price === '') || (type !== 'vente' && demand.trim() === '')) {
            alert('Veuillez remplir tous les champs requis.');
            return;
        }

        try {
            const payload = type === 'vente' ?
            { title, description, category, type, price, isNegotiable } : type === 'troc' ?
            { title, description, category, type, demand, isNegotiable } :
            { title, description, category, type, isNegotiable };

            const res = await api.post('/api/offer/add', payload);
            if (res.status === 201) {
                router.push('/'); // provisional push
            }
        } catch (error) {
            console.error('Erreur lors de la création de l\'offre :', error);
        }
    }

    return (
        <div className={styles.container}>
            <h1>Créer une offre</h1>
            <form onSubmit={handleCreateOffer} className={styles.form}>
                <label htmlFor="title">Titre</label>
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <label htmlFor="description">Description</label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                <label htmlFor="category">Catégorie</label>
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value as Category)} required >
                    <option value="" disabled>Choisir une catégorie</option>
                    <option value="electronique">{Category.electronique}</option>
                    <option value="mobilier">{Category.mobilier}</option>
                    <option value="vetements">{Category.vetements}</option>
                    <option value="livres">{Category.livres}</option>
                    <option value="autres">{Category.autres}</option>
                </select>
                <label htmlFor="images">Images (optionnel)</label>
                <input 
                    type="file" 
                    id="images" 
                    multiple 
                    accept="image/*"
                    onChange={(e) => {
                        const files = e.target.files;
                        setImages(files);
                        if (files && files.length > 0) {
                            const firstImageUrl = URL.createObjectURL(files[0]);
                            setImagePreview(firstImageUrl);
                            setImageCount(files.length);
                        } else {
                            setImagePreview(null);
                            setImageCount(0);
                        }
                    }}
                />
                {imagePreview && (
                    <div className={styles.imagePreview}>
                        <Image src={imagePreview} alt="Aperçu" width={100} height={100} />
                        {imageCount > 1 && (
                            <span className={styles.imageBadge}>+{imageCount - 1}</span>
                        )}
                    </div>
                )}
                <label>Type d&apos;offre</label>
                <div className={styles.radioGroup}>
                    <label>
                        <input type="radio" value="troc" checked={type === 'troc'} onChange={() => setType('troc')} />
                        Troc
                    </label>
                    <label>
                        <input type="radio" value="vente" checked={type === 'vente'} onChange={() => setType('vente')} />
                        Vente
                    </label>
                    <label>
                        <input type="radio" value="don" checked={type === 'don'} onChange={() => setType('don')} />
                        Don
                    </label>
                </div>
                {type === 'vente' ? (
                    <>
                        <label htmlFor="price">Prix (€)</label>
                        <input
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                            required
                        />
                    </>
                ) : type === 'troc' ? (
                    <>
                        <label htmlFor="demand">Contre quoi ?</label>
                        <input
                            type="text"
                            id="demand"
                            value={demand}

                            onChange={(e) => setDemand(e.target.value)}
                            required
                        />
                    </>
                ) : ( <>

                </>)}
                <button type="submit">Créer l&apos;offre</button>
            </form>
        </div>
    )
}
