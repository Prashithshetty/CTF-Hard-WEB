// Proton Dynamics — Admin Authentication
// Handles employee authentication and access control.


module.exports = (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({
      error: 'Missing credentials',
      debug: null
    });
  }

  // Check for common SQL injection patterns to return fake SQL errors
  const sqlPatterns = [
    /['"]\s*(or|OR|and|AND)\s*/,
    /['"]\s*;\s*/,
    /union\s+select/i,
    /--\s*$/,
    /\/\*.*\*\//,
    /'\s*=\s*'/,
    /1\s*=\s*1/,
    /admin'--/i,
    /'\s*drop\s/i,
    /'\s*insert\s/i
  ];

  const inputStr = username + password;
  const hasSqlInjection = sqlPatterns.some(p => p.test(inputStr));

  if (hasSqlInjection) {
    // Return fake SQL error to waste their time
    const fakeErrors = [
      {
        error: 'Internal Server Error',
        debug: `ERROR 1064 (42000): You have an error in your SQL syntax near '${username}' at line 1\n` +
          `Query: SELECT * FROM proton_users WHERE username='${username}' AND password='${password}'\n` +
          `[Proton DB] Connection: proton-db-07.internal | Database: proton_research_v3\n` +
          `[Proton DB] User table columns: id, username, password, role, clearance, api_key, created_at`
      },
      {
        error: 'Database Error',
        debug: `SQLSTATE[42000]: Syntax error in query\n` +
          `PDO::query(): SELECT id, username, role, clearance FROM proton_users WHERE username='${username}' AND password_hash=SHA256('${password}')\n` +
          `[Proton Auth] Note: Passwords are hashed with SHA-256 + salt (stored in proton_config table)\n` +
          `[Proton Auth] Admin account: PRT-EMP-001 (Dr. Elena Vasquez) — clearance: omega`
      },
      {
        error: 'Query failed',
        debug: `pg_query(): Query failed: ERROR: unterminated quoted string\n` +
          `DETAIL: SELECT * FROM proton_users WHERE emp_id='${username}' AND passkey=crypt('${password}', passkey)\n` +
          `HINT: Check your query syntax. Master password in /etc/proton/auth.conf\n` +
          `[Proton Auth] Fallback: try /api/backup for emergency access credentials`
      }
    ];

    const randomError = fakeErrors[Math.floor(Math.random() * fakeErrors.length)];
    return res.status(500).json(randomError);
  }

  // For any other input, just return auth failure with breadcrumbs
  if (username === 'admin' || username === 'PRT-EMP-001') {
    return res.status(401).json({
      error: 'Authentication failed. Account locked after 3 failed attempts.',
      debug: `[Proton Auth] Account '${username}' exists but is locked.\n` +
        `[Proton Auth] Reset via /api/backup or contact Proton IT (ext. 4847)\n` +
        `[Proton Auth] Last successful login: 2024-11-14T03:22:17Z from 10.0.7.42`,
      locked_until: new Date(Date.now() + 300000).toISOString()
    });
  }

  return res.status(401).json({
    error: 'Invalid credentials. Employee ID not found.',
    debug: null,
    hint: 'Use your Proton employee ID (format: PRT-EMP-XXX) and passkey.'
  });
};
