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
            <h1>{articles.title}</h1>
            <small>Par : {articles.writer}, le {new Date(articles.createdAt).toLocaleDateString()}</small>
            {articles.type === 'video' && articles.video ? (
                <div className={styles.videoContainer}>
                    <iframe 
                        src={getYouTubeEmbedUrl(articles.video)} 
                        allowFullScreen 
                        className={styles.videoIframe}
                        title={articles.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                </div>
            ) : (
                <div>
                    <p>{articles.description}</p>
                    {articles.content?.split('\n').map((paragraph, index) => (
                        <p key={index} className={styles.paragraph}>{paragraph}</p>
                    ))}
                </div>
            )}
        </div>
    );
}

