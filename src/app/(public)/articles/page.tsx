'use client';

import { useEffect, useState } from 'react';
import styles from './articles.module.css';
import { Article } from '@/src/types/article';
import { useRouter } from 'next/navigation';

export default function ArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [pagination, setPagination] = useState<{ page: number; limit: number; total: number; pages: number }>({ page: 1, limit: 10, total: 0, pages: 0 });

    const router = useRouter();

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
                {articles.map((article) => (
                    <div key={article._id} className={styles.articleCard} onClick={() => router.push(`/articles/${article._id}`)}>
                        <h2>{article.title}</h2>
                    </div>
                ))}
            </div>
            {pagination && (
                <div className={styles.pagination}>
                    <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1}>
                        Précédent
                    </button>
                    <span>Page {pagination.page} sur {pagination.pages}</span>
                    <button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.pages}>
                        Suivant
                    </button>
                </div>
            )}
        </div>
    );
}
