'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthRoute({children} : {children: React.ReactNode}) {
    const router = useRouter();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            router.push('/profile');
        }
    }, [router]);

    return <>{children}</>;
}