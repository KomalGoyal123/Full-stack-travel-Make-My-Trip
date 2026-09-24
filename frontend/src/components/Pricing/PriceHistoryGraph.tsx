"use client";

import {
    useEffect,
    useState
} from "react";

import {
    useDispatch,
    useSelector
} from "react-redux";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
    Area
} from "recharts";

import {
    RootState,
    AppDispatch
} from "@/store";

import {
    fetchPriceHistory
} from "@/store/pricingSlice";

interface Props {
    entityId: string;
}

export default function PriceHistoryGraph({ entityId }: Props) {
    const dispatch = useDispatch<AppDispatch>();
    const [isClient, setIsClient] = useState(false);
    const [optimalLimit, setOptimalLimit] = useState(20);
    
    const {
        priceHistory,
        loading
    } = useSelector(
        (state: RootState) => state.pricing
    );

    useEffect(() => {
        setIsClient(true);
        
        if (typeof window !== 'undefined') {
            setOptimalLimit(window.innerWidth < 768 ? 10 : 20);
        }
        dispatch(fetchPriceHistory(entityId));
    }, [dispatch, entityId]);

   
    const rawChartData = priceHistory.map((item: any) => ({
        price: item.newPrice,
        time: new Date(item.changedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date(item.changedAt).toLocaleDateString(),
        fullTime: new Date(item.changedAt).toLocaleString(),
        timestamp: new Date(item.changedAt).getTime()
    }));

    
    let chartData;
    if (rawChartData.length > optimalLimit * 2) {
        const step = Math.ceil(rawChartData.length / optimalLimit);
        chartData = rawChartData.filter((_, index) => index % step === 0);
    } else {
        chartData = rawChartData.slice(-optimalLimit);
    }

   
    const allPrices = rawChartData.map(d => d.price);
    const highest = Math.max(...allPrices);
    const lowest = Math.min(...allPrices);
    const average = Math.round(allPrices.reduce((a, b) => a + b, 0) / allPrices.length);
    const firstPrice = allPrices[0];
    const lastPrice = allPrices[allPrices.length - 1];
    const trend = lastPrice >= firstPrice ? "up" : "down";
    const trendPercent = ((lastPrice - firstPrice) / firstPrice * 100).toFixed(1);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-2 sm:p-4 rounded-lg sm:rounded-xl shadow-xl border border-gray-100">
                    <p className="text-[10px] sm:text-xs text-gray-500 mb-1">{data.fullTime || label}</p>
                    <p className="text-base sm:text-2xl font-bold text-indigo-600">
                        ₹{payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    if (!isClient || loading) {
        return (
            <div className="w-full rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-3 sm:p-6 shadow-sm">
                <div className="h-[260px] sm:h-[400px] flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-gray-500 text-xs sm:text-sm">Loading price history...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (chartData.length === 0) {
        return (
            <div className="w-full rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-3 sm:p-6 shadow-sm">
                <div className="h-[260px] sm:h-[400px] flex items-center justify-center">
                    <p className="text-gray-500 text-xs sm:text-sm">No price history available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full rounded-xl sm:rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-3 sm:p-6 pb-0">
                <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-4">
                    <div>
                        <h2 className="text-base sm:text-xl font-bold text-gray-800 flex items-center gap-1.5 sm:gap-2">
                            <span className="text-lg sm:text-2xl">📈</span>
                            Price Trend History
                        </h2>
                        <p className="text-[10px] sm:text-sm text-gray-500 mt-0.5">
                            Based on {allPrices.length} changes | Latest {chartData.length}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="text-right">
                            <p className="text-[9px] sm:text-xs text-gray-400">Current</p>
                            <p className="text-base sm:text-2xl font-bold text-indigo-600">₹{lastPrice}</p>
                        </div>
                        <div className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-sm font-medium ${trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {trend === "up" ? "↑" : "↓"} {Math.abs(Number(trendPercent))}%
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="px-3 sm:px-6 pt-3 sm:pt-4 grid grid-cols-3 gap-2 sm:gap-4">
                <div className="bg-red-50 rounded-lg sm:rounded-xl p-1.5 sm:p-3 text-center">
                    <p className="text-[9px] sm:text-xs text-red-500 font-medium">Highest</p>
                    <p className="text-xs sm:text-xl font-bold text-red-600">₹{highest}</p>
                </div>
                <div className="bg-green-50 rounded-lg sm:rounded-xl p-1.5 sm:p-3 text-center">
                    <p className="text-[9px] sm:text-xs text-green-500 font-medium">Lowest</p>
                    <p className="text-xs sm:text-xl font-bold text-green-600">₹{lowest}</p>
                </div>
                <div className="bg-indigo-50 rounded-lg sm:rounded-xl p-1.5 sm:p-3 text-center">
                    <p className="text-[9px] sm:text-xs text-indigo-500 font-medium">Average</p>
                    <p className="text-xs sm:text-xl font-bold text-indigo-600">₹{average}</p>
                </div>
            </div>

            {/* Chart Container */}
            <div className="w-full px-1 sm:px-2 py-3 sm:py-6">
                <ResponsiveContainer width="100%" height={260}>
                    <LineChart
                        data={chartData}
                        margin={{ top: 15, right: 15, left: 0, bottom: 10 }}
                    >
                        <defs>
                            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        
                        <CartesianGrid strokeDasharray="4 4" stroke="#e9eef3" vertical={false}/>
                        <XAxis 
                            dataKey="time" 
                            tick={{ fontSize: 8, fill: '#94a3b8' }}
                            axisLine={{ stroke: '#e2e8f0' }}
                            tickLine={false}
                            interval="preserveStartEnd"
                            dy={6}
                        />
                        <YAxis 
                            tick={{ fontSize: 8, fill: '#475569' }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => `₹${value}`}
                            width={38}
                            domain={['auto', 'auto']}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        <Legend verticalAlign="top" height={24} iconType="circle" wrapperStyle={{ fontSize: '10px', paddingBottom: '6px' }} />
                        <Line
                            type="monotone"
                            dataKey="price"
                            name="Price (₹)"
                            stroke="#6366f1"
                            strokeWidth={2}
                            dot={{ fill: '#6366f1', stroke: '#fff', strokeWidth: 1, r: 3 }}
                            activeDot={{ r: 5, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }}
                            animationDuration={800}
                            animationEasing="ease-out"
                        />
                        <Area type="monotone" dataKey="price" stroke="none" fill="url(#priceGradient)" fillOpacity={1} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="px-3 sm:px-6 pb-3 sm:pb-6 pt-1 sm:pt-2 border-t border-gray-100">
                <p className="text-[9px] sm:text-[11px] text-gray-400 text-center">
                    Showing latest {chartData.length} points (total: {allPrices.length} changes)
                </p>
            </div>
        </div>
    );
}


