// Proton Dynamics — Secret Vault
// Restricted access to high-clearance research credentials and master keys.


module.exports = (req, res) => {
    const auth = req.headers['authorization'];
    const protonAdmin = req.headers['x-proton-admin'];
    const apiKey = req.headers['x-api-key'] || req.query.key;

    // No auth at all
    if (!auth && !apiKey) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'This endpoint requires authentication.',
            methods: [
                'Bearer token via Authorization header',
                'API key via X-Api-Key header or ?key= parameter',
                'Admin override via X-Proton-Admin header'
            ],
            proton_note: 'Proton Vault access requires OMEGA clearance level.'
        });
    }

    // They sent X-Proton-Admin header
    if (protonAdmin === 'true') {
        return res.status(403).json({
            error: 'Access Denied',
            message: 'X-Proton-Admin header is deprecated since v2.3.0.',
            suggestion: 'Use JWT-based authentication instead.',
            jwt_info: {
                algorithm: 'RS256',
                issuer: 'proton-auth-svc',
                required_claims: ['role', 'clearance', 'iat', 'exp'],
                note: 'Admin role requires clearance level: omega'
            },
            flag: 'HACKFAST{x_pr0t0n_4dm1n_h34d3r_1s_d3pr3c4t3d}'
        });
    }

    // They sent some kind of auth
    if (auth) {
        // Check if it looks like a JWT
        const token = auth.replace('Bearer ', '');
        const parts = token.split('.');

        if (parts.length === 3) {
            try {
                const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());

                // If they crafted a JWT (but this is the WRONG endpoint)
                if (payload.role === 'admin') {
                    return res.status(200).json({
                        status: 'authenticated',
                        clearance: payload.clearance || 'unknown',
                        vault_contents: {
                            master_key: 'proton-master-key-2024',
                            internal_endpoints: ['/api/decrypt', '/api/graphql', '/api/flag'],
                            flag: 'HACKFAST{s0_cl0s3_y3t_s0_f4r_wr0ng_3ndp01nt}',
                            note: 'This flag has been rotated. Check Proton Event logs for the current flag.',
                            event_monitor: 'Event Horizon Monitor is currently OFFLINE (see status dashboard)'
                        },
                        proton_note: 'Vault access logged. Session will expire in 300 seconds.'
                    });
                }

                return res.status(403).json({
                    error: 'Insufficient clearance',
                    your_role: payload.role || 'unknown',
                    required_role: 'admin',
                    message: 'Your JWT is valid but lacks admin privileges.',
                    hint: 'Escalate via /api/graphql mutation: escalatePrivileges'
                });
            } catch (e) {
                // JWT parsing failed
            }
        }

        return res.status(401).json({
            error: 'Invalid token format',
            expected: 'JWT (header.payload.signature)',
            algorithm: 'RS256',
            hint: 'Generate a valid admin JWT. See /api/backup for configuration details.'
        });
    }

    // API key auth
    if (apiKey) {
        if (apiKey === 'prt-admin-7f4a8b2c-9e1d-3f5a-6b7c-8d9e0f1a2b3c') {
            return res.status(200).json({
                status: 'api_key_valid',
                message: 'API key accepted but this key has read-only access.',
                flag: 'HACKFAST{4p1_k3y_g1v3s_r34d_0nly_n0t_th3_fl4g}',
                upgrade: 'For write access, use JWT authentication with admin role.'
            });
        }

        return res.status(401).json({
            error: 'Invalid API key',
            format: 'prt-admin-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
            hint: 'Valid API keys can be found in the backup configuration.'
        });
    }
};
