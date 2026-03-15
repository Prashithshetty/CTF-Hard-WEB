// Proton Dynamics — Flag Endpoint
// "Easy" flag endpoint — this is a trap

module.exports = (req, res) => {
  // Add fake delay to make it feel like it's doing something
  const methods = ['GET', 'POST', 'PUT'];
  
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Proton-Key');
    return res.status(200).end();
  }

  // Easter egg: if they send Authorization header, give them a slightly different fake flag
  const auth = req.headers['authorization'];
  
  if (auth) {
    return res.status(200).json({
      status: 'authenticated',
      clearance: 'level-1',
      flag: 'HACKFAST{auth_h3ader_w0nt_cut_1t_e1th3r}',
      message: 'Congratulations! You found the flag... or did you?',
      next_hint: 'Try /api/secret with admin privileges for the real deal.',
      proton_note: 'Proton Security Division — Access logged.'
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Welcome to the Proton Dynamics CTF!',
    flag: 'HACKFAST{y0u_w1sh_1t_w4s_th1s_34sy}',
    hint: 'This was too easy, wasn\'t it? The real flag is hidden deeper.',
    proton_tip: 'The Proton Core team hides things well. Look harder.',
    endpoints: {
      admin: '/api/login', 
      secret: '/api/secret',
      backup: '/api/backup',
      debug: '/api/graphql'
    }
  });
};
