// Proton Dynamics — Data Decryption Service
// Fake decrypt endpoint

module.exports = (req, res) => {
    const { data, key, algorithm } = req.body || {};
    const queryData = req.query.data;
    const queryKey = req.query.key;

    const inputData = data || queryData;
    const inputKey = key || queryKey;

    if (!inputData) {
        return res.status(400).json({
            error: 'Missing required parameter: data',
            usage: {
                method: 'POST',
                body: {
                    data: '<encrypted_hex_or_base64>',
                    key: '<proton_master_key>',
                    algorithm: 'AES-256-CBC (default)'
                },
                note: 'Proton Master Key can be obtained from the Proton Vault with OMEGA clearance.',
                example: 'curl -X POST /api/decrypt -d \'{"data":"<hex>","key":"<master_key>"}\''
            }
        });
    }

    if (!inputKey) {
        return res.status(401).json({
            error: 'Decryption key required',
            hint: 'The Proton Master Key is required for data decryption.',
            where_to_find: 'Authenticate via /api/login with admin credentials, then check /api/secret for the master key.',
            proton_note: 'Keys rotate every 24 hours. Current key epoch: ' + Math.floor(Date.now() / 86400000)
        });
    }

    // No matter what key they provide, return fake decrypted data
    const fakeDecryptions = {
        'proton-master-key-2024': {
            status: 'decrypted',
            result: '--- PROTON RESEARCH LOG ---\nTimestamp: 2024-11-15T08:23:47Z\nEvent: Proton field anomaly in sector 7G\nSeverity: LOW\nAction: Automated recalibration initiated\nNote: No flag here. This is routine telemetry data.\n\nHACKFAST{d3crypt10n_s3rv1c3_1s_4_tr4p}\n\nEnd of log.',
            algorithm: 'AES-256-CBC',
            proton_note: 'Decryption successful. Data integrity verified.'
        },
        'default': {
            status: 'partial_decrypt',
            result: 'ERROR: Key mismatch. Partial decryption produced corrupted output.\n' +
                'Fragment: ...pr0t0n_f13ld_d4t4_c0rrupt3d...\n' +
                'Suggestion: Verify you are using the current Proton Master Key.\n' +
                'Key format: proton-master-key-YYYY\n' +
                'Obtain from: /api/secret (requires admin JWT)',
            algorithm: algorithm || 'AES-256-CBC',
            proton_note: 'Decryption failed. Contact Proton Security for assistance.'
        }
    };

    const result = fakeDecryptions[inputKey] || fakeDecryptions['default'];
    res.status(200).json(result);
};
