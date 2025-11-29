/* eslint-disable */
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Wifi, Activity, Terminal, ExternalLink, Copy, Check, BarChart3, Info, Layers } from 'lucide-react';
import { simulationEvents } from '@/lib/simulation';

interface Transaction {
    hash: string;
    timestamp: number;
    eventType: string;
    droneId: string;
}

type TabType = 'logs' | 'transactions' | 'dashboard' | 'about';

export default function HUD() {
    const [tps, setTps] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [copiedHash, setCopiedHash] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('logs');
    const [droneCount] = useState(50);
    const [eventsPublished, setEventsPublished] = useState(0);
    const logsEndRef = useRef<HTMLDivElement>(null);

    // Listen for blockchain transactions from window events
    useEffect(() => {
        const handleTransaction = (event: any) => {
            const { hash, eventType, droneId } = event.detail;
            setTransactions(prev => [{
                hash,
                timestamp: Date.now(),
                eventType,
                droneId
            }, ...prev.slice(0, 19)]); // Keep last 20
            setEventsPublished(prev => prev + 1);
        };

        window.addEventListener('blockchain-tx', handleTransaction);
        return () => window.removeEventListener('blockchain-tx', handleTransaction);
    }, []);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedHash(text);
        setTimeout(() => setCopiedHash(null), 2000);
    };

    const openExplorer = (hash: string) => {
        window.open(`https://shannon-explorer.somnia.network/tx/${hash}`, '_blank');
    };

    useEffect(() => {
        let mounted = true;

        // Subscribe to simulation events (shows immediately in UI)
        const unsubscribe = simulationEvents.subscribe((event) => {
            if (!mounted) return;
            const logMessage = `[${event.droneId}] ${event.message}`;
            setLogs(prev => [...prev.slice(-9), logMessage]);
        });

        // TPS counter animation
        const interval = setInterval(() => {
            setTps(Math.floor(4000 + Math.random() * 500));
        }, 500);

        // Initial welcome message
        setTimeout(() => {
            if (mounted) {
                setLogs(prev => [...prev, '[SYSTEM] AeroMesh initialization complete']);
                setTimeout(() => {
                    if (mounted) {
                        setLogs(prev => [...prev, '[SYSTEM] 50 autonomous drones active']);
                    }
                }, 1000);
            }
        }, 2000);

        return () => {
            mounted = false;
            clearInterval(interval);
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <>
            {/* Top Header Bar */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/90 via-black/80 to-transparent backdrop-blur-sm border-b border-white/10 pointer-events-none z-50">
                <div className="px-8 py-4 flex items-center justify-between pointer-events-auto">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold text-white tracking-tight">
                                AeroMesh
                            </h1>
                            <p className="text-sm text-gray-400 font-light">Digital Twin Simulation</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
                            <div>
                                <div className="text-emerald-400 text-sm font-medium">Connected</div>
                                <div className="text-gray-400 text-xs">Somnia Testnet</div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                            <Activity className="w-5 h-5 text-cyan-400" />
                            <div>
                                <div className="text-cyan-400 text-lg font-semibold tabular-nums">{tps.toLocaleString()}</div>
                                <div className="text-gray-400 text-xs">TPS</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="px-8 pb-3 flex gap-2 pointer-events-auto">
                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`px-5 py-2 text-sm font-medium transition-all flex items-center gap-2 rounded-lg ${
                            activeTab === 'logs' 
                                ? 'bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/20' 
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Terminal className="w-4 h-4" />
                        Live Logs
                    </button>
                    <button
                        onClick={() => setActiveTab('transactions')}
                        className={`px-5 py-2 text-sm font-medium transition-all flex items-center gap-2 rounded-lg ${
                            activeTab === 'transactions' 
                                ? 'bg-amber-500/20 text-amber-400 shadow-lg shadow-amber-500/20' 
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Activity className="w-4 h-4" />
                        Transactions
                    </button>
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`px-5 py-2 text-sm font-medium transition-all flex items-center gap-2 rounded-lg ${
                            activeTab === 'dashboard' 
                                ? 'bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/20' 
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <BarChart3 className="w-4 h-4" />
                        Dashboard
                    </button>
                    <a
                        href="https://github.com/SohamJuneja/AeroMesh"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2 text-sm font-medium transition-all flex items-center gap-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
                    >
                        <Info className="w-4 h-4" />
                        About
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            </div>

            {/* Content Panels */}
            {activeTab === 'logs' && (
                <div className="absolute bottom-6 right-6 w-[500px] pointer-events-auto z-50">
                    <div className="bg-black/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/20 overflow-hidden">
                        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-5 py-3 border-b border-white/10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Terminal className="w-4 h-4 text-cyan-400" />
                                    <h3 className="text-sm font-medium text-white">Live Activity</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-gray-400">Streaming</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 space-y-2 max-h-[300px] overflow-y-auto">
                            {logs.slice(-5).map((log, i) => (
                                <div 
                                    key={i} 
                                    className="bg-black/60 border border-cyan-500/30 rounded-lg px-4 py-3 animate-in fade-in slide-in-from-bottom-2 duration-300 backdrop-blur-sm"
                                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
                                >
                                    <div className="flex items-start gap-3">
                                        <span 
                                            className="text-xs text-cyan-400 font-mono mt-0.5 tabular-nums font-semibold"
                                            style={{ color: '#22d3ee' }}
                                        >
                                            {new Date().toLocaleTimeString()}
                                        </span>
                                        <span 
                                            className="text-sm text-white font-medium flex-1 leading-relaxed"
                                            style={{ color: '#ffffff' }}
                                        >
                                            {log}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {logs.length === 0 && (
                                <div className="text-center py-8">
                                    <Terminal className="w-8 h-8 mx-auto mb-3 text-cyan-400 opacity-50" />
                                    <p className="text-white text-sm" style={{ color: '#ffffff' }}>Initializing drone swarm...</p>
                                </div>
                            )}
                            <div ref={logsEndRef} />
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'transactions' && (
                <div className="absolute top-[180px] left-1/2 -translate-x-1/2 w-[700px] max-h-[calc(100vh-220px)] pointer-events-auto z-50">
                    <div className="bg-black/95 backdrop-blur-xl border border-amber-500/30 rounded-2xl shadow-2xl shadow-amber-500/20 overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-6 py-4 border-b border-white/10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Activity className="w-5 h-5 text-amber-400" />
                                    <h3 className="text-lg font-medium text-white">Blockchain Transactions</h3>
                                </div>
                                <span className="text-sm text-gray-400">{transactions.length} total</span>
                            </div>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[calc(100vh-300px)]">
                            {transactions.length === 0 ? (
                                <div className="text-center py-12">
                                    <Activity className="w-12 h-12 mx-auto mb-4 text-amber-400 opacity-50" />
                                    <p className="text-sm text-white">Waiting for transactions...</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {transactions.map((tx) => (
                                        <div key={tx.hash} className="bg-black/50 border border-white/20 rounded-xl p-4 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/20 transition-all backdrop-blur-sm">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-emerald-400 font-medium text-sm" style={{ color: '#34d399' }}>{tx.eventType}</span>
                                                <span className="text-gray-400 text-xs tabular-nums" style={{ color: '#9ca3af' }}>{new Date(tx.timestamp).toLocaleTimeString()}</span>
                                            </div>
                                            <div className="text-cyan-400 text-xs mb-3" style={{ color: '#22d3ee' }}>Drone: {tx.droneId}</div>
                                            <div className="flex items-center gap-2">
                                                <code className="text-gray-300 text-xs flex-1 truncate bg-black/50 px-3 py-2 rounded-lg font-mono" style={{ color: '#d1d5db' }}>
                                                    {tx.hash}
                                                </code>
                                                <button
                                                    onClick={() => copyToClipboard(tx.hash)}
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                    title="Copy hash"
                                                >
                                                    {copiedHash === tx.hash ? (
                                                        <Check className="w-4 h-4 text-emerald-400" />
                                                    ) : (
                                                        <Copy className="w-4 h-4 text-gray-400" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => openExplorer(tx.hash)}
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                    title="View on explorer"
                                                >
                                                    <ExternalLink className="w-4 h-4 text-amber-400" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'dashboard' && (
                <div className="absolute top-[180px] left-1/2 -translate-x-1/2 w-[700px] max-h-[calc(100vh-220px)] pointer-events-auto z-50">
                    <div className="bg-black/95 backdrop-blur-xl border border-emerald-500/30 rounded-2xl shadow-2xl shadow-emerald-500/20 overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 px-6 py-4 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <BarChart3 className="w-5 h-5 text-emerald-400" />
                                <h3 className="text-lg font-medium text-white">Analytics Dashboard</h3>
                            </div>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[calc(100vh-300px)]">
                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 p-5 rounded-xl">
                                    <div className="text-gray-400 text-sm mb-2 font-light">Active Drones</div>
                                    <div className="text-cyan-400 text-4xl font-semibold tabular-nums">{droneCount}</div>
                                </div>
                                
                                <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 p-5 rounded-xl">
                                    <div className="text-gray-400 text-sm mb-2 font-light">Events Published</div>
                                    <div className="text-amber-400 text-4xl font-semibold tabular-nums">{eventsPublished}</div>
                                </div>
                                
                                <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 p-5 rounded-xl">
                                    <div className="text-gray-400 text-sm mb-2 font-light">Network TPS</div>
                                    <div className="text-emerald-400 text-3xl font-semibold tabular-nums">{tps.toLocaleString()}</div>
                                </div>
                                
                                <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 p-5 rounded-xl">
                                    <div className="text-gray-400 text-sm mb-2 font-light">Uptime</div>
                                    <div className="text-purple-400 text-3xl font-semibold tabular-nums">99.9%</div>
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                                <h4 className="text-white text-sm font-medium mb-4">System Status</h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 font-light">Blockchain</span>
                                        <span className="text-emerald-400 font-medium">✓ Synced</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 font-light">Schema</span>
                                        <span className="text-emerald-400 font-medium">✓ Registered</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 font-light">WebGL Renderer</span>
                                        <span className="text-emerald-400 font-medium">✓ 60 FPS</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 font-light">Data Streams</span>
                                        <span className="text-emerald-400 font-medium">✓ Active</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                                <h4 className="text-white text-sm font-medium mb-4">Contract Information</h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400 font-light">Network</span>
                                        <span className="text-white">Somnia Testnet</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400 font-light">Chain ID</span>
                                        <span className="text-white tabular-nums">50312</span>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 text-xs mb-2 font-light">Contract Address</div>
                                        <code className="text-amber-400 text-xs break-all bg-black/50 px-3 py-2 rounded-lg block font-mono">
                                            0xC1d833a80469854a7450Dd187224b2ceE5ecE264
                                        </code>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

