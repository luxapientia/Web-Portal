'use client';

import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { ReactNode } from 'react';

interface AuthCardProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
    return (
        <Box
            component="main"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: { xs: 3, sm: 4, md: 6 },
                px: { xs: 2, sm: 3 },
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: { xs: '300px', sm: '500px', md: '800px' },
                    p: { xs: 2.5, sm: 3, md: 4 },
                    textAlign: 'center',
                    borderRadius: { xs: '20px', sm: '24px' },
                    background: '#ffffff',
                }}
            >
                {/* Logo Container */}
                <Box
                    sx={{
                        width: { xs: '100px', sm: '120px', md: '140px' },
                        height: { xs: '100px', sm: '120px', md: '140px' },
                        position: 'relative',
                        mb: { xs: 2, sm: 2.5, md: 3 },
                        mx: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Image
                        src="/images/auth_logo.png"
                        alt="Double Bubble Logo"
                        fill
                        sizes="(max-width: 600px) 100px, (max-width: 900px) 120px, 140px"
                        style={{
                            objectFit: 'contain',
                            width: '100%',
                            height: '100%'
                        }}
                        priority
                    />
                </Box>

                {/* Title */}
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        mb: subtitle ? 1 : { xs: 2, sm: 3, md: 4 },
                        fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                        fontWeight: 'bold',
                        color: '#000',
                    }}
                >
                    {title}
                </Typography>

                {/* Subtitle */}
                {subtitle && (
                    <Typography
                        variant="body1"
                        sx={{
                            mb: { xs: 2, sm: 3, md: 4 },
                            color: '#666',
                            fontSize: { xs: '1rem', sm: '1.1rem' },
                        }}
                    >
                        {subtitle}
                    </Typography>
                )}

                {children}
            </Box>
        </Box>
    );
} 