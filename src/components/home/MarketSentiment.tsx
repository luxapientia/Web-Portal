'use client';

import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
    PriceUpdate,
    type Symbol,
    AVAILABLE_SYMBOLS
} from '@/schemas/price.schema';
import { fetchWithAuth } from '@/lib/api';

type PriceRecord = Record<Symbol, Omit<PriceUpdate, 'symbol'>>;

export default function MarketSentiment() {
    const [prices, setPrices] = useState<PriceRecord>({} as PriceRecord);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPrices();
    }, []);

    const fetchPrices = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetchWithAuth('/api/prices', {
                method: 'GET',
                requireAuth: true
            });

            if (!response) {
                throw new Error('Authentication required');
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch prices');
            }

            const data = await response.json();
            setPrices(data);
        } catch (err) {
            console.error('Failed to fetch prices:', err);
            setError('Failed to fetch price data');
        } finally {
            setLoading(false);
        }
    };

    // Function to format price with color based on price change
    const renderPrice = (symbol: Symbol) => {
        const priceData = prices[symbol];

        if (loading) {
            return (
                <Typography variant="h5" color="text.secondary" fontWeight={900}>
                    Loading...
                </Typography>
            );
        }

        if (error) {
            return (
                <Typography variant="h5" color="error" fontWeight={900}>
                    {error}
                </Typography>
            );
        }

        if (!priceData) {
            return (
                <Typography variant="h5" color="text.secondary" fontWeight={900}>
                    No data available
                </Typography>
            );
        }

        const priceChange24h = priceData.priceChange?.['24h'] || 0;
        const priceChangeColor = priceChange24h > 0 ? 'success.main' :
            priceChange24h < 0 ? 'error.main' :
                'text.primary';

        return (
            <>
                <Typography variant="h5" color={priceChangeColor} fontWeight={900}>
                    ${priceData.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
                <Typography variant="body2" color={priceChangeColor}>
                    {priceChange24h.toFixed(2)}% (24h)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Last updated: {priceData.timestamp.toLocaleTimeString()}
                </Typography>
            </>
        );
    };

    return (
        <>
            <Typography variant="h6" fontWeight={700} mb={2}>Crypto Market Sentiment</Typography>
            <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    <Box sx={{ flex: '1 1 45%', minWidth: '45%', bgcolor: '#fff', borderRadius: 3, p: { xs: 2, md: 3 }, mb: 1, boxShadow: 2 }}>
                        <Typography variant="body1" fontWeight={800}>Binance BNB</Typography>
                        {renderPrice('BNB')}
                    </Box>
                    <Box sx={{ flex: '1 1 45%', minWidth: '45%', bgcolor: '#fff', borderRadius: 3, p: { xs: 2, md: 3 }, mb: 1, boxShadow: 2 }}>
                        <Typography variant="body1" fontWeight={800}>Ethereum ETH</Typography>
                        {renderPrice('ETH')}
                    </Box>
                    <Box sx={{ flex: '1 1 45%', minWidth: '45%', bgcolor: '#fff', borderRadius: 3, p: { xs: 2, md: 3 }, mb: 1, boxShadow: 2 }}>
                        <Typography variant="body1" fontWeight={800}>Litecoin LTC</Typography>
                        {renderPrice('LTC')}
                    </Box>
                    <Box sx={{ flex: '1 1 45%', minWidth: '45%', bgcolor: '#fff', borderRadius: 3, p: { xs: 2, md: 3 }, mb: 1, boxShadow: 2 }}>
                        <Typography variant="body1" fontWeight={800}>Bitcoin BTC</Typography>
                        {renderPrice('BTC')}
                    </Box>
                </Box>
            </Box>
        </>
    );
} 