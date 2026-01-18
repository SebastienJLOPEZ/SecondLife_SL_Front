import ProtectedRoute from '@/src/components/protectedRoute/protectedRoute';

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <ProtectedRoute>{children}</ProtectedRoute>;
}
