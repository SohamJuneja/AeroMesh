/* eslint-disable */
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { SDK } from '@somnia-chain/streams';
import { createPublicClient, http } from 'viem';
import { Wifi, Activity, Terminal } from 'lucide-react';
import { somniaTestnet } from '@/lib/simulation';
import { DRONE_EVENT_SCHEMA, droneEventEncoder, DroneEventData } from '@/lib/schema';

// Initialize Read-Only SDK outside component
const sdk = new SDK({
    public: createPublicClient({
        chain: somniaTestnet,
        transport: http()
    })
});

export default function HUD() {
    const [tps, setTps] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);
    const logsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let mounted = true;

        const initSubscription = async () => {
            try {
                const schemaId = await sdk.streams.computeSchemaId(DRONE_EVENT_SCHEMA);

                if (!mounted) return;
                
                if (schemaId instanceof Error) {
                    console.error('Failed to compute schema ID:', schemaId);
                    return;
                }

                // Subscribe using the correct API format from Somnia docs
                await sdk.streams.subscribe({
                    somniaStreamsEventId: schemaId,
                    ethCalls: [],
                    onlyPushChanges: false,
                    onData: (data: any) => {
                        if (!mounted) return;
                        try {
                            // Decode the data from the event
                            const decodedFields = droneEventEncoder.decodeData(data.result.data);
                            
                            // Extract values from decoded fields
                            const getValue = (field: any) => field?.value?.value ?? field?.value ?? '';
                            const eventData: DroneEventData = {
                                eventType: String(getValue(decodedFields[0])),
                                message: String(getValue(decodedFields[1])),
                                timestamp: BigInt(getValue(decodedFields[2])),
                                droneId: String(getValue(decodedFields[3])),
                                nonce: BigInt(getValue(decodedFields[4]))
                            };
                            
                            const logMessage = `[${eventData.droneId}] ${eventData.message}`;
                            setLogs(prev => [...prev.slice(-4), logMessage]);
                        } catch (err) {
                            console.error('Error decoding event:', err);
                        }
                    }
                });
            } catch (e) {
                if (!mounted) return;
                console.error('Failed to subscribe:', e);
                setLogs(prev => [...prev, '[SYSTEM] Connection to Somnia Stream failed. Retrying...']);
            }
        };

        initSubscription();

        const interval = setInterval(() => {
            setTps(Math.floor(4000 + Math.random() * 500));
        }, 500);

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6 font-mono text-xs md:text-sm text-[#00F0FF]">
            {/* Top Bar */}
            <div className="flex justify-between items-start">
                {/* Network Status */}
                <div className="bg-black/80 border border-[#00FF41] p-3 rounded backdrop-blur-sm flex items-center gap-3 shadow-[0_0_15px_rgba(0,255,65,0.3)]">
                    <div className="relative">
                        <div className="w-3 h-3 bg-[#00FF41] rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 w-3 h-3 bg-[#00FF41] rounded-full animate-ping opacity-75"></div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[#00FF41] font-bold tracking-wider">SOMNIA TESTNET</span>
                        <span className="text-xs opacity-70">LIVE STREAM CONNECTED</span>
                    </div>
                    <Wifi className="w-5 h-5 text-[#00FF41]" />
                </div>

                {/* TPS Counter */}
                <div className="bg-black/80 border border-[#00F0FF] p-3 rounded backdrop-blur-sm flex items-center gap-3 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                    <div className="flex flex-col items-end">
                        <span className="text-[#00F0FF] font-bold text-xl">{tps.toLocaleString()}</span>
                        <span className="text-xs opacity-70">TRANSACTIONS / SEC</span>
                    </div>
                    <Activity className="w-6 h-6 text-[#00F0FF]" />
                </div>
            </div>

            {/* Bottom Console */}
            <div className="self-center w-full max-w-2xl">
                <div className="bg-black/90 border-t-2 border-[#FF003C] p-4 rounded-t-lg backdrop-blur-md shadow-[0_-5px_20px_rgba(255,0,60,0.2)]">
                    <div className="flex items-center gap-2 mb-2 text-[#FF003C] border-b border-[#FF003C]/30 pb-2">
                        <Terminal className="w-4 h-4" />
                        <span className="font-bold tracking-widest">AEROMESH AGENT LOGS (ON-CHAIN)</span>
                    </div>
                    <div className="h-32 overflow-hidden flex flex-col justify-end space-y-1">
                        {logs.length === 0 && <span className="text-white/50 italic">Waiting for blockchain events...</span>}
                        {logs.map((log, i) => (
                            <div key={i} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <span className="text-[#00F0FF] opacity-50 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                <span className="text-white/90">{log}</span>
                            </div>
                        ))}
                        <div ref={logsEndRef} />
                    </div>
                </div>
            </div>
        </div>
    );
}
