import { Logo } from '@/components/ui/Logo';

const AuthLayout = ({ children }: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className="bg-background flex min-h-screen w-full">
            {/* Left Column - Graphic/Branding */}
            <div className="bg-secondary hidden w-1/2 flex-col justify-between p-12 text-white lg:flex border-r border-border">
                <div>
                    <Logo />
                </div>

                <div className="max-w-lg space-y-6">
                    <h2 className="text-4xl leading-tight font-semibold">Digital Agency Admin Panel</h2>
                    <p className="text-primary-text/80 text-lg">
                        Securely manage works, articles, services, and digital experiences.
                    </p>
                </div>

                <div className="text-primary-text/60 flex items-center gap-4 text-sm">
                    <span>&copy; {new Date().getFullYear()} Digital Soft Zone. All rights reserved.</span>
                </div>
            </div>

            {/* Right Column - Login Form */}
            <div className="flex w-full items-center justify-center p-4 sm:p-10 lg:w-1/2 relative">
                {children}
            </div>
        </div>
    )
}

export default AuthLayout
