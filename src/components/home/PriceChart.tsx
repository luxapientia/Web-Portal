'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { MarketChartData } from '@/services/CoinGecko';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface PriceChartProps {
  coinId: string;
  coinName: string;
  days?: number | 'max';
  interval?: 'daily' | 'hourly';
}

export default function PriceChart({ coinId, coinName, days = 30, interval = 'daily' }: PriceChartProps) {
  const [chartData, setChartData] = useState<MarketChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/market-sentiment/chart?coinId=${coinId}&days=${days}&interval=${interval}`
        );

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch chart data');
        }

        setChartData(result.data);
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch chart data');
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [coinId, days, interval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-lg">
        Loading chart...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-red-50 rounded-lg text-red-600">
        {error}
      </div>
    );
  }

  if (!chartData) {
    return null;
  }

  const data = {
    labels: chartData.timestamps,
    datasets: [
      {
        label: `${coinName} Price`,
        data: chartData.prices,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: interval === 'hourly' ? 'hour' : 'day' as const,
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Price (USD)',
        },
        ticks: {
          callback: (value) => {
            return '$' + value.toLocaleString();
          },
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${coinName} Price Chart (${days} ${days === 1 ? 'day' : 'days'})`,
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200" style={{ height: '400px' }}>
      <Line data={data} options={options} />
    </div>
  );
} 