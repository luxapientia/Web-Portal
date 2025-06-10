'use client';

import { Box, Typography, IconButton, Collapse } from "@mui/material";
import { useEffect, useState } from "react";
import {
    PriceUpdate,
} from '@/schemas/price.schema';
// import PriceChart from './PriceChart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// Helper function to generate trend line path
const generateTrendPath = (trend: 'up' | 'down') => {
    // Create a curved line that goes up or down
    const height = 24;
    const width = 60;
    const startY = trend === 'up' ? height : 0;
    const endY = trend === 'up' ? 0 : height;

    return `M0,${startY} C20,${startY} 40,${endY} ${width},${endY}`;
};

export default function MarketSentiment() {
    const [prices, setPrices] = useState<Record<string, PriceUpdate>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedCoin, setExpandedCoin] = useState<string | null>(null);

    useEffect(() => {
        fetchPrices();
        // Set up auto-refresh every 30 seconds
        const interval = setInterval(fetchPrices, 60 * 5 * 1000);
        return () => clearInterval(interval);
    }, []);

    const fetchPrices = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/market-sentiment/current', {
                method: 'GET',
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Failed to fetch prices');
            }
            setPrices(result.data);
        } catch (err) {
            console.error('Failed to fetch prices:', err);
            setError('Failed to fetch price data');
        } finally {
            setLoading(false);
        }
    };

    const renderCryptoCard = (symbol: string, priceData: PriceUpdate) => {
        const priceChange24h = priceData?.priceChange?.['24h'] || 0;
        const trend: 'up' | 'down' = priceChange24h >= 0 ? 'up' : 'down';
        const trendColor = trend === 'up' ? '#4CAF50' : '#FF5252';
        const isExpanded = expandedCoin === symbol;

        return (
            <Box key={symbol}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        borderBottom: '1px solid #e0e0e0',
                        '&:last-child': {
                            borderBottom: 'none',
                        },
                        cursor: 'pointer',
                        '&:hover': {
                            bgcolor: 'rgba(0, 0, 0, 0.02)',
                        },
                    }}
                    onClick={() => setExpandedCoin(isExpanded ? null : symbol)}
                >
                    {loading ? (
                        <Box sx={{ width: 32, height: 32, bgcolor: '#f5f5f5', borderRadius: '50%' }} />
                    ) : (
                        <img
                            src={priceData?.image}
                            alt={`${symbol} icon`}
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                            }}
                        />
                    )}

                    <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            {`${priceData?.name} (${symbol})`}
                        </Typography>
                    </Box>

                    <Box sx={{ position: 'relative', width: 60, height: 24 }}>
                        {!loading && (
                            <svg
                                width="60"
                                height="24"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                }}
                            >
                                <path
                                    d={generateTrendPath(trend)}
                                    stroke={trendColor}
                                    strokeWidth="2"
                                    fill="none"
                                />
                            </svg>
                        )}
                    </Box>

                    <Box sx={{ textAlign: 'right', minWidth: 100 }}>
                        {loading ? (
                            <Box sx={{ height: 24, width: 80, bgcolor: '#f5f5f5', borderRadius: 1 }} />
                        ) : (
                            <>
                                <Typography variant="body1" fontWeight="bold">
                                    ${priceData?.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: trendColor }}
                                >
                                    {priceChange24h > 0 ? '+' : ''}{priceChange24h.toFixed(2)}%
                                </Typography>
                            </>
                        )}
                    </Box>
                </Box>
            </Box>
        );
    };

    const renderContent = () => {
        if (error) {
            return (
                <Typography color="error" sx={{ p: 2 }}>
                    {error}
                </Typography>
            );
        }

        if (loading) {
            // Show loading placeholders for 4 items
            return Array(4).fill(null).map((_, index) => (
                <Box
                    key={`loading-${index}`}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        borderBottom: '1px solid #e0e0e0',
                        '&:last-child': {
                            borderBottom: 'none',
                        }
                    }}
                >
                    <Box sx={{ width: 32, height: 32, bgcolor: '#f5f5f5', borderRadius: '50%' }} />
                    <Box sx={{ flex: 1 }}>
                        <Box sx={{ width: 40, height: 20, bgcolor: '#f5f5f5', borderRadius: 1 }} />
                    </Box>
                    <Box sx={{ width: 60, height: 24 }} />
                    <Box sx={{ textAlign: 'right', minWidth: 100 }}>
                        <Box sx={{ height: 24, width: 80, bgcolor: '#f5f5f5', borderRadius: 1, mb: 1 }} />
                        <Box sx={{ height: 20, width: 60, bgcolor: '#f5f5f5', borderRadius: 1 }} />
                    </Box>
                </Box>
            ));
        }

        return Object.entries(prices)
            .sort(([, a], [, b]) => (b.price || 0) - (a.price || 0)) // Sort by price, highest first
            .map(([symbol, priceData]) => renderCryptoCard(symbol, priceData));
    };

    return (
        <Box sx={{ bgcolor: '#ffffff', borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                Crypto Market Sentiment
            </Typography>

            {renderContent()}

            <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
                <Typography variant="body2" color="text.secondary">
                    Investor sentiment is cautiously optimistic, with altcoins and institutional deals boosting confidence despite Bitcoin&apos;s slowdown. Traders remain alert to inflation and interest rate signals that may affect the market.
                </Typography>
            </Box>
        </Box>
    );
} 