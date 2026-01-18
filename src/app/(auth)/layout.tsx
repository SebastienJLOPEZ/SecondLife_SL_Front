import AuthRoute from '@/src/components/authRoute/authRoute';

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AuthRoute>{children}</AuthRoute>;
}
