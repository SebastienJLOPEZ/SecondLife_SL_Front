'use client';

import {useState, useEffect, use} from 'react';
import styles from './article.module.css';
import {Article} from '@/src/types/article';

export default function ArticlesPage( { params }: { params: Promise<{ id: string }> } ) {
    const [articles, setArticles] = useState<Article>(null!);
    const { id } = use(params);

    const getYouTubeEmbedUrl = (url: string) => {
        // Convertir les URLs YouTube en format embed
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        
        if (match && match[2].length === 11) {
            return `https://www.youtube.com/embed/${match[2]}`;
        }
        
        return url;
    };

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/article/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                const res = await response.json();
                if (res.success) {
                    setArticles(res.article);
                } else {
                    console.error('Failed to fetch article:', res.message);
                }
            } catch (error) {
                console.error('Error fetching article:', error);
            }
        };
        fetchArticle();
    }, [id]);

    if (!articles) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            {/* Titre */}
            <h1 className={styles.title}>{articles.title}</h1>
            
            {/* Description */}
            {articles.description && (
                <p className={styles.description}>{articles.description}</p>
            )}
            
            {/* Badges + Date + Auteur */}
            <div className={styles.metaInfo}>
                <div className={styles.badges}>
                    <span className={styles.badge}>{articles.category}</span>
                    <span className={styles.badge}>{articles.type}</span>
                </div>
                <div className={styles.info}>
                    <span className={styles.writer}>Par {articles.writer}</span>
                    <span className={styles.separator}>•</span>
                    <span className={styles.date}>{new Date(articles.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>
            
            {/* Vidéo */}
            {articles.video && (
                <div className={styles.videoContainer}>
                    <iframe 
                        src={getYouTubeEmbedUrl(articles.video)} 
                        allowFullScreen 
                        className={styles.videoIframe}
                        title={articles.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                </div>
            )}
            
            {/* Contenu */}
            {articles.content && (
                <div className={styles.content}>
                    {articles.content.split('\n').map((paragraph, index) => (
                        paragraph.trim() && <p key={index} className={styles.paragraph}>{paragraph}</p>
                    ))}
                </div>
            )}
        </div>
    );
}

