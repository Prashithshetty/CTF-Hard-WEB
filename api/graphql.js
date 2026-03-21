// Proton Dynamics — GraphQL Interface
// Unified query gateway for internal data exploration and system metrics.


module.exports = (req, res) => {
    const body = req.body || {};
    const query = body.query || req.query.query || '';

    // Handle introspection queries — return tantalizing but useless schema
    if (query.includes('__schema') || query.includes('__type') || query.includes('IntrospectionQuery')) {
        return res.status(200).json({
            data: {
                __schema: {
                    queryType: { name: 'Query' },
                    mutationType: { name: 'Mutation' },
                    types: [
                        {
                            kind: 'OBJECT',
                            name: 'Query',
                            fields: [
                                { name: 'getFlag', args: [{ name: 'adminKey', type: { name: 'String' } }], type: { name: 'Flag' } },
                                { name: 'getUser', args: [{ name: 'empId', type: { name: 'String' } }], type: { name: 'ProtonUser' } },
                                { name: 'getResearchData', args: [{ name: 'projectId', type: { name: 'String' } }, { name: 'clearance', type: { name: 'String' } }], type: { name: 'ResearchData' } },
                                { name: 'getSystemStatus', args: [], type: { name: 'SystemStatus' } },
                                { name: 'getDecryptionKey', args: [{ name: 'keyId', type: { name: 'String' } }], type: { name: 'DecryptionKey' } }
                            ]
                        },
                        {
                            kind: 'OBJECT',
                            name: 'Mutation',
                            fields: [
                                { name: 'authenticate', args: [{ name: 'username', type: { name: 'String' } }, { name: 'password', type: { name: 'String' } }], type: { name: 'AuthResponse' } },
                                { name: 'escalatePrivileges', args: [{ name: 'token', type: { name: 'String' } }, { name: 'targetRole', type: { name: 'String' } }], type: { name: 'AuthResponse' } },
                                { name: 'decryptData', args: [{ name: 'data', type: { name: 'String' } }, { name: 'key', type: { name: 'String' } }], type: { name: 'DecryptedData' } }
                            ]
                        },
                        {
                            kind: 'OBJECT', name: 'Flag',
                            fields: [
                                { name: 'value', type: { name: 'String' } },
                                { name: 'category', type: { name: 'String' } },
                                { name: 'difficulty', type: { name: 'String' } }
                            ]
                        },
                        {
                            kind: 'OBJECT', name: 'ProtonUser',
                            fields: [
                                { name: 'empId', type: { name: 'String' } },
                                { name: 'name', type: { name: 'String' } },
                                { name: 'role', type: { name: 'String' } },
                                { name: 'clearance', type: { name: 'String' } },
                                { name: 'apiKey', type: { name: 'String' } }
                            ]
                        },
                        {
                            kind: 'OBJECT', name: 'AuthResponse',
                            fields: [
                                { name: 'token', type: { name: 'String' } },
                                { name: 'role', type: { name: 'String' } },
                                { name: 'expiresAt', type: { name: 'String' } }
                            ]
                        }
                    ]
                }
            }
        });
    }

    // Handle getFlag queries
    if (query.includes('getFlag')) {
        return res.status(200).json({
            data: {
                getFlag: {
                    value: 'HACKFAST{gr4phql_1ntr0sp3ct10n_1s_fun_but_us3l3ss}',
                    category: 'web',
                    difficulty: 'easy'
                }
            },
            _proton_note: 'Proton GraphQL Gateway v2.1 — query logged'
        });
    }

    // Handle getUser queries  
    if (query.includes('getUser')) {
        return res.status(200).json({
            data: {
                getUser: {
                    empId: 'PRT-EMP-001',
                    name: 'Dr. Elena Vasquez',
                    role: 'admin',
                    clearance: 'omega',
                    apiKey: 'prt_REDACTED_contact_it_for_key_reset'
                }
            }
        });
    }

    // Handle authenticate mutations
    if (query.includes('authenticate') || query.includes('escalatePrivileges')) {
        return res.status(200).json({
            data: {
                authenticate: {
                    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiZ3Vlc3QiLCJjbGVhcmFuY2UiOiJub25lIiwiZmxhZyI6IkhBQ0tGQVNUe2p3dF9mcjBtX2dyNHBocWxfMXNfZjRrM30ifQ.FAKE_SIG',
                    role: 'guest',
                    expiresAt: new Date(Date.now() + 3600000).toISOString()
                }
            },
            errors: [{ message: 'Insufficient privileges. Admin authentication requires VPN access.' }]
        });
    }

    // Default response
    res.status(200).json({
        data: null,
        errors: [{
            message: 'Query parsing failed. Use introspection to discover available queries.',
            hint: 'Try: { __schema { queryType { name } types { name fields { name } } } }'
        }],
        _proton: 'Proton GraphQL Gateway v2.1'
    });
};
