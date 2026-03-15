// Proton Dynamics — Event Horizon Monitor
// REAL VULNERABILITY: Server-Side Template Injection (SSTI) via Nunjucks
//
// Step 1: Player must include X-Proton-Decay header
// Step 2: Player must exploit SSTI in the ?query= parameter
//   - Nunjucks template engine renders user input unsafely
//   - Payload: {{process.env.CTF_FLAG}} extracts the flag from env var

const nunjucks = require('nunjucks');

// Configure nunjucks — intentionally unsafe (no sandboxing)
const env = new nunjucks.Environment(null, { autoescape: false });

module.exports = (req, res) => {
    // Must have X-Proton-Decay header
    const decayHeader = req.headers['x-proton-decay'];

    if (!decayHeader) {
        return res.status(403).json({
            error: 'Access denied',
            message: 'This endpoint requires Proton Decay authorization.',
            proton_note: 'Event Horizon Monitor is restricted to decay analysis personnel.'
        });
    }

    // Get query parameter
    const query = req.query.query;

    if (!query) {
        return res.status(400).json({
            error: 'Missing query parameter',
            message: 'Provide a Proton Query Language expression via ?query= parameter.',
            examples: [
                '?query=status',
                '?query=field_strength',
                '?query=decay_rate'
            ],
            proton_note: 'Proton Query Language supports template expressions for computed metrics.'
        });
    }

    // Handle some "normal" queries to make it look legit
    const staticResponses = {
        'status': 'Event Horizon Monitor: ONLINE — Last calibration: 2024-11-15T08:23:47Z',
        'field_strength': 'Proton field strength: 7.4 Tesla (nominal range: 7.0-8.0 T)',
        'decay_rate': 'Observed proton decay rate: < 1.67 × 10^-34 /year (below detection threshold)',
        'help': 'Available queries: status, field_strength, decay_rate, beam_energy, coherence'
    };

    if (staticResponses[query]) {
        return res.status(200).json({
            status: 'success',
            query: query,
            result: staticResponses[query],
            timestamp: new Date().toISOString(),
            proton_note: 'Event Horizon Monitor — Proton Research Division'
        });
    }

    // SSTI VULNERABILITY: render user input through Nunjucks template engine
    // This allows template injection like {{7*7}} or {{process.env.CTF_FLAG}}
    try {
        const rendered = env.renderString(query, { process: process, global: global, require: require });

        return res.status(200).json({
            status: 'success',
            query: query,
            result: rendered,
            timestamp: new Date().toISOString(),
            proton_note: 'Proton Query Language expression evaluated successfully.'
        });
    } catch (err) {
        return res.status(400).json({
            error: 'Query evaluation failed',
            message: 'Invalid Proton Query Language expression.',
            detail: err.message,
            proton_note: 'Check expression syntax. Template expressions use {{ }} delimiters.'
        });
    }
};
