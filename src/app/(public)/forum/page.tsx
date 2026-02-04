'use client';

import { useState, useEffect } from 'react';
import styles from './forum.module.css';
import { Thread } from '@/src/types/thread';
import Link from 'next/link';

export default function ForumPage() {
    const [threads, setThreads] = useState<Thread[]>([]);
    const [adminThreads, setAdminThreads] = useState<Thread[]>([]);
    const [pagination, setPagination] = useState<{ page: number; limit: number; total: number; pages: number }>({ page: 1, limit: 10, total: 0, pages: 0 });
    
    const fetchPublicThreads = async (page: number) => {
        try {
            const payload = new URLSearchParams ({
                page: page.toString(),
                limit: '10',
            });

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/thread?${payload.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const res = await response.json();

            if (res.success) {
                setThreads(res.threads);
                setPagination(res.pagination);
            }
        } catch (error) {
            console.error('Error fetching threads:', error);
        }
    };

    const fetchAdminThreads = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/thread/admin`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const res = await response.json();
            if (res.success) {
                setAdminThreads(res.threads);
            }
        } catch (error) {
            console.error('Error fetching admin threads:', error);
        }
    };


    useEffect(() => {
        const loadThreads = async () => {
            await fetchPublicThreads(1);
            await fetchAdminThreads();
        }
        loadThreads();
    }, []);

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > pagination.pages) return;
        fetchPublicThreads(newPage);
    };

    return (
        <div className={styles.forumContainer}>
            <h1>Forum</h1>
            <div className={styles.adminThreadsSection}>
                <h2>Forum Généraux</h2>
                {adminThreads.map((thread) => (
                    <Link key={thread._id} href={`/forum/${thread._id}`}  className={styles.threadCard}>
                        <h3>{thread.subject}</h3>
                        <p>Posté par: {thread.poster?.name} {thread.poster?.surname}</p>
                        <p>Messages: {thread.messages.length}</p>
                        <p>Créé le: {new Date(thread.createdAt).toLocaleDateString()}</p>
                    </Link>
                ))}
                </div>
            <div className={styles.publicThreadsSection}>
                <h2>Threads Publics</h2>
                {threads.map((thread) => (
                    <Link key={thread._id} href={`/forum/${thread._id}`}  className={styles.threadCard}>
                        <h3>{thread.subject}</h3>
                        <p>Posté par: {thread.poster?.name} {thread.poster?.surname}</p>
                        <p>Messages: {thread.messages.length}</p>
                        <p>Créé le: {new Date(thread.createdAt).toLocaleDateString()}</p>
                    </Link>
                ))}
                <div className={styles.pagination}>
                    <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1}>
                        Précédent
                    </button>
                    <span>Page {pagination.page} de {pagination.pages}</span>
                    <button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.pages}>
                        Suivant
                    </button>
                </div>
            </div>
        </div>
    );
}