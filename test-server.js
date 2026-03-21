// Proton Dynamics — Internal Development Server
// Local emulation of Vercel serverless environment.


const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

// Load env vars from .env
try {
    const envFile = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
    envFile.split('\n').forEach(line => {
        const [key, ...vals] = line.split('=');
        if (key && vals.length) process.env[key.trim()] = vals.join('=').trim();
    });
} catch (e) { }

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.txt': 'text/plain'
};

const server = http.createServer(async (req, res) => {
    const parsed = url.parse(req.url, true);
    const pathname = parsed.pathname;

    // API routes — load serverless function
    if (pathname.startsWith('/api/')) {
        const funcName = pathname.replace('/api/', '').replace(/\/$/, '');
        const funcPath = path.join(__dirname, 'api', funcName + '.js');

        if (fs.existsSync(funcPath)) {
            // Parse JSON body for POST requests
            let body = '';
            await new Promise(resolve => {
                req.on('data', chunk => body += chunk);
                req.on('end', resolve);
            });

            if (body) {
                try { req.body = JSON.parse(body); } catch (e) { req.body = {}; }
            } else {
                req.body = {};
            }

            req.query = parsed.query || {};

            // Add Express/Vercel-compatible methods to res
            const headers = {};
            const origSetHeader = res.setHeader.bind(res);
            res.setHeader = (key, val) => { headers[key] = val; origSetHeader(key, val); };

            res.status = (code) => {
                res.statusCode = code;
                return res;
            };
            res.json = (data) => {
                res.writeHead(res.statusCode || 200, { 'Content-Type': 'application/json', ...headers });
                res.end(JSON.stringify(data));
            };
            res.send = (data) => {
                const contentType = headers['Content-Type'] || 'text/plain';
                res.writeHead(res.statusCode || 200, { 'Content-Type': contentType, ...headers });
                res.end(typeof data === 'string' ? data : JSON.stringify(data));
            };
            res.end = ((origEnd) => function (data) {
                if (!res.headersSent) {
                    res.writeHead(res.statusCode || 200, headers);
                }
                origEnd.call(res, data);
            })(res.end.bind(res));

            try {
                // Clear require cache so changes take effect
                delete require.cache[require.resolve(funcPath)];
                const handler = require(funcPath);
                handler(req, res);
            } catch (err) {
                console.error('API Error:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal server error', detail: err.message }));
            }
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Endpoint not found' }));
        }
        return;
    }

    // Static file routes
    let filePath;
    if (pathname === '/' || pathname === '/index.html') {
        filePath = path.join(__dirname, 'public', 'index.html');
    } else if (pathname === '/login') {
        filePath = path.join(__dirname, 'public', 'login.html');
    } else if (pathname === '/dashboard') {
        filePath = path.join(__dirname, 'public', 'dashboard.html');
    } else {
        filePath = path.join(__dirname, 'public', pathname);
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath);
        const mime = mimeTypes[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': mime });
        fs.createReadStream(filePath).pipe(res);
    } else {
        // Fallback to index.html
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream(path.join(__dirname, 'public', 'index.html')).pipe(res);
    }
});

server.listen(PORT, () => {
    console.log(`\n  Proton Dynamics CTF — Local Test Server`);
    console.log(`  Running at: http://localhost:${PORT}\n`);
    console.log(`  CTF_FLAG loaded: ${process.env.CTF_FLAG ? 'YES' : 'NO'}\n`);
});
