'use client';

import { useEffect, useRef, useState } from 'react';
import {
    Chart as ChartJS,
    LineController,
    LineElement,
    LinearScale,
    PointElement,
    Filler,
    Tooltip,
    ChartOptions,
    ChartData,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { Box } from '@mui/material';
import { CryptoPrice } from '@/schemas/price.schema';

ChartJS.register(LineController, LineElement, LinearScale, PointElement, Filler, Tooltip);

interface PriceHistoryResponse {
    success: boolean;
    data: CryptoPrice[];
}

export default function PriceGraph({ symbol }: { symbol: string }) {
    const chartRef = useRef<ChartJS<'line'>>(null);
    const [graphData, setGraphData] = useState<ChartData<'line'> | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/market-sentiment/history?symbol=${symbol}`);
                const json = await res.json() as PriceHistoryResponse;
                const prices = json.data;

                if (!prices || prices.length < 2) return;

                setGraphData({
                    labels: prices.map((_, i) => i), // just index-based labels
                    datasets: [
                        {
                            data: prices.map((p) => p.price),
                            borderColor: '#4caf50',
                            backgroundColor: 'transparent',
                            tension: 0.4,
                            borderWidth: 2,
                            pointRadius: 0,
                            fill: false,
                        },
                    ],
                });
            } catch (err) {
                console.error('Sparkline error:', err);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [symbol]);

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 3,
        scales: {
            x: { display: false, type: 'linear' },
            y: { display: false },
        },
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
        },
    };

    if (!graphData) return null;

    return (
        <Box sx={{ 
            flex: 1,
            minWidth: '120px',
            maxWidth: '200px',
            height: '40px',
            mx: 2
        }}>
            <Chart
                ref={chartRef}
                type="line"
                data={graphData}
                options={options}
            />
        </Box>
    );
}
