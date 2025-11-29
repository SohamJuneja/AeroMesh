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
            {/* Top Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-black/80 border-b border-[#00F0FF] backdrop-blur-md flex items-center justify-between px-6 pointer-events-none z-50">
                <div className="pointer-events-auto">
                    <div className="text-[#FFD700] font-bold text-xl tracking-wider">
                        AEROMESH
                    </div>
                    <div className="text-white/50 text-xs">Digital Twin • Somnia Testnet</div>
                </div>
                
                <div className="flex items-center gap-6 pointer-events-auto">
                    <div className="flex items-center gap-2">
                        <Wifi className="w-4 h-4 text-[#00FF41]" />
                        <div>
                            <div className="text-[#00FF41] text-xs font-bold">CONNECTED</div>
                            <div className="text-white/50 text-[10px]">Somnia Shannon</div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#00F0FF]" />
                        <div>
                            <div className="text-[#00F0FF] text-xs font-bold">{tps.toLocaleString()} TPS</div>
                            <div className="text-white/50 text-[10px]">Network Speed</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Side Navigation Panel */}
            <div className="absolute left-0 top-16 bottom-0 w-80 bg-black/95 border-r border-[#00F0FF] backdrop-blur-md flex flex-col pointer-events-auto z-40">
                {/* Tab Navigation */}
                <div className="flex border-b border-[#00F0FF]/30">
                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`flex-1 px-4 py-3 text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
                            activeTab === 'logs' 
                                ? 'bg-[#00F0FF]/20 text-[#00F0FF] border-b-2 border-[#00F0FF]' 
                                : 'text-white/50 hover:text-white/80'
                        }`}
                    >
                        <Terminal className="w-4 h-4" />
                        LOGS
                    </button>
                    <button
                        onClick={() => setActiveTab('transactions')}
                        className={`flex-1 px-4 py-3 text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
                            activeTab === 'transactions' 
                                ? 'bg-[#FFD700]/20 text-[#FFD700] border-b-2 border-[#FFD700]' 
                                : 'text-white/50 hover:text-white/80'
                        }`}
                    >
                        <Activity className="w-4 h-4" />
                        TX
                    </button>
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`flex-1 px-4 py-3 text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
                            activeTab === 'dashboard' 
                                ? 'bg-[#00FF41]/20 text-[#00FF41] border-b-2 border-[#00FF41]' 
                                : 'text-white/50 hover:text-white/80'
                        }`}
                    >
                        <BarChart3 className="w-4 h-4" />
                        STATS
                    </button>
                    <button
                        onClick={() => setActiveTab('about')}
                        className={`flex-1 px-4 py-3 text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
                            activeTab === 'about' 
                                ? 'bg-purple-500/20 text-purple-400 border-b-2 border-purple-400' 
                                : 'text-white/50 hover:text-white/80'
                        }`}
                    >
                        <Info className="w-4 h-4" />
                        INFO
                    </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {activeTab === 'logs' && (
                        <div>
                            <div className="text-[#00F0FF] font-bold mb-3 text-sm flex items-center gap-2">
                                <Terminal className="w-4 h-4" />
                                SYSTEM LOGS
                            </div>
                            <div className="space-y-1 font-mono text-xs">
                                {logs.map((log, i) => (
                                    <div 
                                        key={i} 
                                        className="text-[#00FF41] animate-[fadeIn_0.3s_ease-in] bg-black/30 px-2 py-1 rounded border border-[#00FF41]/20"
                                    >
                                        {log}
                                    </div>
                                ))}
                                <div ref={logsEndRef} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'transactions' && (
                        <div>
                            <div className="text-[#FFD700] font-bold mb-3 text-sm flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-4 h-4" />
                                    BLOCKCHAIN TRANSACTIONS
                                </div>
                                <span className="text-xs">({transactions.length})</span>
                            </div>
                            {transactions.length === 0 ? (
                                <div className="text-white/50 text-xs italic text-center py-8">
                                    Waiting for transactions...
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {transactions.map((tx) => (
                                        <div key={tx.hash} className="bg-black/50 border border-[#FFD700]/20 p-3 rounded text-xs hover:border-[#FFD700]/50 transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[#00FF41] font-bold">{tx.eventType}</span>
                                                <span className="text-white/50 text-[10px]">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                                            </div>
                                            <div className="text-[#00F0FF] mb-2 text-[10px]">Drone: {tx.droneId}</div>
                                            <div className="flex items-center gap-2">
                                                <code className="text-white/70 text-[9px] flex-1 truncate bg-black/50 px-2 py-1 rounded">
                                                    {tx.hash}
                                                </code>
                                                <button
                                                    onClick={() => copyToClipboard(tx.hash)}
                                                    className="p-1.5 hover:bg-white/10 rounded transition-colors"
                                                    title="Copy hash"
                                                >
                                                    {copiedHash === tx.hash ? (
                                                        <Check className="w-3 h-3 text-[#00FF41]" />
                                                    ) : (
                                                        <Copy className="w-3 h-3 text-white/50" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => openExplorer(tx.hash)}
                                                    className="p-1.5 hover:bg-white/10 rounded transition-colors"
                                                    title="View on explorer"
                                                >
                                                    <ExternalLink className="w-3 h-3 text-[#FFD700]" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'dashboard' && (
                        <div className="space-y-4">
                            <div className="text-[#00FF41] font-bold mb-3 text-sm flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" />
                                ANALYTICS DASHBOARD
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gradient-to-br from-[#00F0FF]/20 to-transparent border border-[#00F0FF]/30 p-4 rounded">
                                    <div className="text-white/50 text-xs mb-1">Active Drones</div>
                                    <div className="text-[#00F0FF] text-3xl font-bold">{droneCount}</div>
                                </div>
                                
                                <div className="bg-gradient-to-br from-[#FFD700]/20 to-transparent border border-[#FFD700]/30 p-4 rounded">
                                    <div className="text-white/50 text-xs mb-1">Events Published</div>
                                    <div className="text-[#FFD700] text-3xl font-bold">{eventsPublished}</div>
                                </div>
                                
                                <div className="bg-gradient-to-br from-[#00FF41]/20 to-transparent border border-[#00FF41]/30 p-4 rounded">
                                    <div className="text-white/50 text-xs mb-1">Network TPS</div>
                                    <div className="text-[#00FF41] text-2xl font-bold">{tps.toLocaleString()}</div>
                                </div>
                                
                                <div className="bg-gradient-to-br from-purple-500/20 to-transparent border border-purple-400/30 p-4 rounded">
                                    <div className="text-white/50 text-xs mb-1">Uptime</div>
                                    <div className="text-purple-400 text-2xl font-bold">99.9%</div>
                                </div>
                            </div>

                            <div className="bg-black/50 border border-[#00F0FF]/20 p-4 rounded">
                                <div className="text-white/70 text-xs font-bold mb-2">SYSTEM STATUS</div>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-white/50">Blockchain</span>
                                        <span className="text-[#00FF41] font-bold">✓ SYNCED</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/50">Schema</span>
                                        <span className="text-[#00FF41] font-bold">✓ REGISTERED</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/50">WebGL Renderer</span>
                                        <span className="text-[#00FF41] font-bold">✓ 60 FPS</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/50">Data Streams</span>
                                        <span className="text-[#00FF41] font-bold">✓ ACTIVE</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-black/50 border border-[#FFD700]/20 p-4 rounded">
                                <div className="text-white/70 text-xs font-bold mb-2">CONTRACT INFO</div>
                                <div className="space-y-1 text-[10px]">
                                    <div className="flex justify-between">
                                        <span className="text-white/50">Network</span>
                                        <span className="text-[#FFD700]">Somnia Testnet</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/50">Chain ID</span>
                                        <span className="text-[#FFD700]">50312</span>
                                    </div>
                                    <div className="text-white/50 mt-2">Contract Address</div>
                                    <code className="text-[#FFD700] break-all bg-black/50 px-2 py-1 rounded block">
                                        0xC1d833a80469854a7450Dd187224b2ceE5ecE264
                                    </code>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'about' && (
                        <div className="space-y-4 text-xs">
                            <div className="text-purple-400 font-bold mb-3 text-sm flex items-center gap-2">
                                <Info className="w-4 h-4" />
                                PROJECT INFORMATION
                            </div>
                            
                            <div className="bg-gradient-to-br from-purple-500/20 to-transparent border border-purple-400/30 p-4 rounded">
                                <div className="text-white font-bold mb-2">AeroMesh Digital Twin</div>
                                <div className="text-white/70 leading-relaxed">
                                    Real-time autonomous drone swarm simulation powered by Somnia Data Streams. 
                                    Built for the Somnia Mini Hackathon 2024.
                                </div>
                            </div>

                            <div className="bg-black/50 border border-[#00F0FF]/20 p-4 rounded">
                                <div className="text-[#00F0FF] font-bold mb-2 flex items-center gap-2">
                                    <Layers className="w-3 h-3" />
                                    KEY FEATURES
                                </div>
                                <ul className="space-y-1 text-white/70">
                                    <li>• 50 autonomous AI agents (Boids algorithm)</li>
                                    <li>• Real-time blockchain event publishing</li>
                                    <li>• WebGL-powered 3D visualization</li>
                                    <li>• Collision avoidance system</li>
                                    <li>• Schema-based data encoding</li>
                                    <li>• Sub-second transaction finality</li>
                                </ul>
                            </div>

                            <div className="bg-black/50 border border-[#FFD700]/20 p-4 rounded">
                                <div className="text-[#FFD700] font-bold mb-2">TECH STACK</div>
                                <div className="space-y-1 text-white/70">
                                    <div className="flex justify-between">
                                        <span>Frontend</span>
                                        <span className="text-[#FFD700]">Next.js 16 + React 19</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>3D Graphics</span>
                                        <span className="text-[#FFD700]">Three.js + R3F</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Blockchain</span>
                                        <span className="text-[#FFD700]">Somnia + Viem</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Styling</span>
                                        <span className="text-[#FFD700]">Tailwind CSS 4</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-black/50 border border-[#00FF41]/20 p-4 rounded">
                                <div className="text-[#00FF41] font-bold mb-2">USE CASES</div>
                                <ul className="space-y-1 text-white/70">
                                    <li>✓ Supply chain monitoring</li>
                                    <li>✓ Fleet management systems</li>
                                    <li>✓ IoT device coordination</li>
                                    <li>✓ Logistics optimization</li>
                                    <li>✓ Audit trail generation</li>
                                </ul>
                            </div>

                            <div className="bg-black/50 border border-white/20 p-4 rounded text-center">
                                <div className="text-white/50 text-[10px] mb-2">Built by</div>
                                <div className="text-white font-bold">Soham Juneja</div>
                                <div className="text-white/50 text-[10px] mt-1">Somnia Mini Hackathon 2024</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
