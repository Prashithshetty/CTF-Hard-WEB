// Proton Dynamics — WebSocket Telemetry Feed
// Fake WS endpoint that returns cryptic encoded messages

module.exports = (req, res) => {
    // Can't do real WebSocket on Vercel serverless, so fake it
    // Return data that LOOKS like leaked WebSocket frames

    const timestamp = Date.now();
    const fakeFrames = [
        {
            frame_id: 1,
            timestamp: timestamp - 5000,
            type: 'PROTON_FIELD_UPDATE',
            channel: 'proton-telemetry-07',
            payload: Buffer.from('Proton field strength: nominal. No anomalies detected in sector 7G.').toString('base64'),
            checksum: 'a94f2e8b'
        },
        {
            frame_id: 2,
            timestamp: timestamp - 3000,
            type: 'PROTON_AUTH_EVENT',
            channel: 'proton-auth-svc',
            payload: Buffer.from('Session validation: token expired for user PRT-EMP-042. Re-auth required.').toString('base64'),
            checksum: '3c1d7f6e'
        },
        {
            frame_id: 3,
            timestamp: timestamp - 2000,
            type: 'PROTON_CORE_METRIC',
            channel: 'proton-core-engine',
            payload: Buffer.from('Core throughput: 2.41B particles/sec. Queue depth: 847. Latency: 0.3ms.').toString('base64'),
            checksum: '5a4b3c2d'
        },
        {
            frame_id: 4,
            timestamp: timestamp - 1000,
            type: 'PROTON_SECURITY_ALERT',
            channel: 'proton-soc',
            payload: Buffer.from('ALERT: Multiple failed auth attempts from external IP. Source: CTF participant. No action needed.').toString('base64'),
            checksum: '1e0f9a8b'
        },
        {
            frame_id: 5,
            timestamp: timestamp,
            type: 'PROTON_INTERNAL',
            channel: 'proton-flag-svc',
            payload: Buffer.from('HACKFAST{w3bs0ck3t_fr4m3s_4r3_4_d34d_3nd_t00}').toString('base64'),
            checksum: '7c8d9e0f',
            encrypted: true,
            key_hint: 'Proton Master Key required for decryption'
        }
    ];

    res.setHeader('X-Proton-WS-Fallback', 'true');
    res.setHeader('X-Proton-Note', 'WebSocket upgrade not supported — HTTP fallback active');

    res.status(200).json({
        status: 'ws_fallback',
        message: 'WebSocket upgrade not available. Returning buffered frames via HTTP.',
        server: 'proton-telemetry-07.internal',
        frames: fakeFrames,
        reconnect_url: 'wss://telemetry.protondynamics.internal:8443',
        note: 'For real-time feed, connect via WebSocket from the internal network.'
    });
};
