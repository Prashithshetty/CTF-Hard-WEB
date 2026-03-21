// Proton Dynamics — Proton Core Engine API
// This API provides access to real-time particle interaction data and system diagnostics.
// Authentication is required via session tokens.


const jwt = require('jsonwebtoken');

const JWT_SECRET = 'proton';

module.exports = (req, res) => {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return res.status(200).end();
    }

    // Must be POST
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed',
            allowed: ['POST'],
            proton_note: 'Proton Core API requires authenticated POST requests.'
        });
    }

    // Step 1: JWT Validation
    const sessionToken = req.query.session;

    if (!sessionToken) {
        return res.status(401).json({
            error: 'Missing session token',
            message: 'Provide a valid session token via ?session= parameter.',
            proton_note: 'Proton Core Engine requires authenticated sessions.'
        });
    }

    let decoded;
    try {
        decoded = jwt.verify(sessionToken, JWT_SECRET, { algorithms: ['HS256'] });
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                error: 'Invalid session token',
                detail: 'Token signature verification failed.',
                proton_note: 'Session tokens must be issued by Proton Auth Service.'
            });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Session expired',
                detail: 'Re-authenticate to obtain a fresh session token.'
            });
        }
        return res.status(401).json({ error: 'Authentication failed' });
    }

    // Verify required claims
    if (decoded.role !== 'engineer' || decoded.clearance !== 'omega') {
        return res.status(403).json({
            error: 'Insufficient privileges',
            your_role: decoded.role,
            your_clearance: decoded.clearance,
            required: 'engineer with omega clearance',
            proton_note: 'Only Proton Core engineers with OMEGA clearance can access this endpoint.'
        });
    }

    // Step 2: Process JSON body — vulnerable to prototype pollution
    const body = req.body || {};

    // Intentionally vulnerable merge function
    function unsafeMerge(target, source) {
        for (const key in source) {
            if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
                if (!target[key]) target[key] = {};
                unsafeMerge(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
        return target;
    }

    // Create a fresh object and merge user input into it
    const config = {};
    const originalProtoKeys = Object.getOwnPropertyNames(Object.prototype);
    unsafeMerge(config, body);

    // Build response
    const response = {
        status: 'success',
        message: 'Proton Core Engine — diagnostics data',
        session: {
            role: decoded.role,
            clearance: decoded.clearance,
            authenticated: true
        },
        diagnostics: {
            core_version: '8.4.1',
            uptime: '847h 23m',
            throughput: '2.41B particles/sec',
            field_coherence: '98.7%',
            active_experiments: 47
        }
    };

    // The prototype pollution check — if isAdmin was polluted onto Object.prototype,
    // it will be accessible on this fresh object via prototype chain
    const check = {};
    if (check.isAdmin === true) {
        // Prototype pollution successful — reveal the hidden path
        const hiddenPath = Buffer.from('/api/proton-event-horizon').toString('base64');
        response.admin_access = {
            granted: true,
            message: 'Admin override detected. Extended diagnostics enabled.',
            // The path to the next stage, base64 encoded
            extended_endpoint: hiddenPath,
            required_header: 'X-Proton-Decay',
            proton_note: 'Event Horizon Monitor accepts Proton query language via ?query= parameter.'
        };
    }

    // Clean up prototype pollution to not affect other requests
    // Remove all polluted keys to prevent Denial of Service on serverless functions
    const currentProtoKeys = Object.getOwnPropertyNames(Object.prototype);
    for (const key of currentProtoKeys) {
        if (!originalProtoKeys.includes(key)) {
            delete Object.prototype[key];
        }
    }

    res.status(200).json(response);
};
