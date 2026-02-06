'use client';

import { useEffect, useState } from 'react';
import styles from './articles.module.css';
import { Article } from '@/src/types/article';
import { useRouter } from 'next/navigation';

export default function ArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [pagination, setPagination] = useState<{ page: number; limit: number; total: number; pages: number }>({ page: 1, limit: 10, total: 0, pages: 0 });

    const router = useRouter();

    // Fonction pour extraire l'ID YouTube d'une URL
    const getYouTubeId = (url: string): string | null => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Fonction pour tronquer le texte
    const truncateText = (text: string | undefined, maxLength: number = 150): string => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    // Formater la date
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    // Obtenir uniquement la date (sans heure) pour comparaison
    const getDateOnly = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR');
    };

    const fetchArticles = async (page: number) => {
        try {
            const payload = new URLSearchParams ({
                page: page.toString(),
                limit: '10',
            });

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/article?${payload.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const res = await response.json();
            if (res.success) {
                setArticles(res.articles);
                setPagination(res.pagination);
            }
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
    };

    useEffect(() => {
        const loadArticles = async () => {
            await fetchArticles(1);
        };
        
        loadArticles();
    }, []);

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > pagination.pages) return;
        fetchArticles(newPage);
    };

    return (
        <div className={styles.container}>
            <h1>Articles</h1>
            <div className={styles.articlesList}>
                {articles.map((article, index) => {
                    const youtubeId = article.video ? getYouTubeId(article.video) : null;
                    const currentDate = getDateOnly(article.createdAt);
                    const previousDate = index > 0 ? getDateOnly(articles[index - 1].createdAt) : null;
                    const showDateSeparator = index === 0 || currentDate !== previousDate;
                    
                    return (
                        <div key={article._id}>
                            {showDateSeparator && (
                                <div className={styles.dateSeparator}>
                                    <span className={styles.dateLabel}>{formatDate(article.createdAt)}</span>
                                </div>
                            )}
                            
                            <div className={styles.articleCard} onClick={() => router.push(`/articles/${article._id}`)}>
                            {youtubeId && (
                                <div className={styles.videoContainer}>
                                    <iframe
                                        src={`https://www.youtube.com/embed/${youtubeId}`}
                                        title={article.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className={styles.videoPlayer}
                                    />
                                </div>
                            )}
                            
                            <div className={styles.articleContent}>
                                <div className={styles.categoryBadges}>
                                    <span className={styles.badge}>{article.category}</span>
                                    <span className={styles.badge}>{article.type}</span>
                                </div>
                                
                                <h2 className={styles.articleTitle}>{article.title}</h2>
                                
                                {article.description && (
                                    <p className={styles.articleDescription}>
                                        {truncateText(article.description)}
                                    </p>
                                )}
                                
                                <div className={styles.articleFooter}>
                                    <span className={styles.writer}>✍️ {article.writer}</span>
                                    <span className={styles.date}>📅 {formatDate(article.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                        </div>
                    );
                })}
            </div>
            {pagination && pagination.pages > 1 && (
                <div className={styles.pagination}>
                    <button 
                        onClick={() => handlePageChange(pagination.page - 1)} 
                        disabled={pagination.page === 1}
                        className={styles.paginationButton}
                    >
                        Précédent
                    </button>
                    <span className={styles.paginationInfo}>Page {pagination.page} sur {pagination.pages}</span>
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
