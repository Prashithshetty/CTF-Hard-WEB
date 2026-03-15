/**
 * ========================================
 * Proton Dynamics — Frontend Application
 * Version: 3.8.2-rc4
 * Proton Web Module — Internal Distribution
 * ========================================
 * 
 * WARNING: This code contains proprietary Proton algorithms.
 * Reverse engineering is prohibited under Proton NDA Section 14.
 * 
 * Proton field calibration routines are embedded below.
 * Do not modify without authorization from the Proton Core Team.
 */

(function() {
  'use strict';

  // ============================================================
  // Proton Configuration Module
  // ============================================================
  
  // Fake config that looks juicy but leads nowhere
  const _0x4f2a = {
    api_base: '/api',
    telemetry_ws: 'wss://telemetry.protondynamics.internal:8443',
    auth_endpoint: '/api/login',
    session_cookie: 'prt_session',
    refresh_endpoint: '/api/refresh-token',
    graphql_endpoint: '/api/graphql',
    // Looks like a debug flag
    debug: false,
    // Looks like leaked internal endpoints
    internal: {
      flag_service: '/api/flag',
      admin_panel: '/api/admin-panel',
      vault: '/api/secret-vault',
      backup: '/api/backup'
    },
    // Fake encryption keys
    encryption: {
      public_key: 'prt_pub_7f4a8b2c9e1d3f5a6b7c8d9e0f1a2b3c',
      cipher: 'AES-256-CBC',
      iv: 'proton-iv-00000001'
    }
  };

  // ============================================================
  // MISDIRECTION: Fake "secret" functions that look important
  // ============================================================
  
  function _protonDecrypt(data, key) {
    // This function does absolutely nothing useful
    // but looks like it might decrypt something
    try {
      const decoded = atob(data);
      const result = [];
      for (let i = 0; i < decoded.length; i++) {
        result.push(String.fromCharCode(
          decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        ));
      }
      return result.join('');
    } catch(e) {
      return null;
    }
  }

  function _protonValidateSession(token) {
    // Fake session validation — looks like JWT parsing
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      const payload = JSON.parse(atob(parts[1]));
      return payload.role === 'admin' && payload.exp > Date.now() / 1000;
    } catch(e) {
      return false;
    }
  }

  // Red herring: looks like it fetches the flag
  async function _fetchProtonFlag() {
    try {
      const res = await fetch('/api/flag', {
        headers: { 'Authorization': 'Bearer ' + _0x4f2a.encryption.public_key }
      });
      return await res.json();
    } catch(e) {
      return null;
    }
  }

  // Red herring: looks like secret admin access
  async function _protonAdminEscalate() {
    const session = document.cookie.split(';').find(c => c.trim().startsWith('prt_session='));
    if (!session) return null;
    try {
      const res = await fetch('/api/secret', {
        headers: { 
          'Authorization': 'Bearer ' + session.split('=')[1],
          'X-Proton-Admin': 'true'
        }
      });
      return await res.json();
    } catch(e) {
      return null;
    }
  }

  // ============================================================
  // MISDIRECTION: Encoded strings that decode to nonsense/trolls
  // ============================================================
  
  // Decodes to: "Never gonna give you up, never gonna let you down"
  const _prt_field_data = 'TmV2ZXIgZ29ubmEgZ2l2ZSB5b3UgdXAsIG5ldmVyIGdvbm5hIGxldCB5b3UgZG93bg==';
  
  // Decodes to: "HACKFAST{b4s364_d3c0d3_w0nt_s4v3_y0u}"
  const _prt_calibration = 'HACKFAST{b4s364_d3c0d3_w0nt_s4v3_y0u}';
  
  // Decodes to: "The flag is not here. Keep looking."
  const _prt_resonance = 'VGhlIGZsYWcgaXMgbm90IGhlcmUuIEtlZXAgbG9va2luZy4=';

  // Fake hex-encoded "secret" — decodes to a troll message
  const _prt_quantum_state = '596f7520776173746564203230206d696e75746573206465636f64696e67207468697321';

  // ============================================================
  // MISDIRECTION: Fake vulnerability — "accidentally" exposed
  // debug console that looks like it leaks info
  // ============================================================
  
  const ProtonDebugger = {
    enabled: false,
    log: function(msg) {
      if (this.enabled) console.log('[PROTON DEBUG] ' + msg);  
    },
    // Looks like it reveals internal state
    dumpState: function() {
      return {
        session: 'EXPIRED',
        role: 'guest',
        clearance: 'none',
        db_connected: true,
        cache_hit_rate: 0.94,
        flag_endpoint: '/api/flag',
        admin_key: 'prt-admin-' + Math.random().toString(36).substr(2, 16),
        jwt_secret: 'THIS_IS_NOT_THE_REAL_SECRET',
        internal_note: 'Real flag is at /api/secret — requires admin JWT'
      };
    }
  };

  // "Accidentally" expose to window for "debugging"
  window.__PROTON_DEBUG__ = ProtonDebugger;

  // ============================================================
  // THE REAL CLUE — deeply buried and obfuscated
  // This is the only actual breadcrumb to the solution
  // ============================================================
  
  // Obfuscated function names to hide the real endpoint
  const _0xe3f1 = ['\x70\x72\x6f\x74\x6f\x6e','\x63\x6f\x72\x65'];
  const _0x7b2d = function(a,b) { return a + '-' + b; };
  
  // This builds the string "proton-core" when called
  // The actual API endpoint is /api/proton-core
  const _protonFieldInit = function() {
    const _e = _0x7b2d(_0xe3f1[0], _0xe3f1[1]);
    const _p = '/' + '\x61\x70\x69' + '/' + _e;
    return _p;
  };

  // Obfuscated: the JWT needs role:"engineer" and clearance:"omega"
  // Hidden inside what looks like a config validation function  
  function _validateProtonConfig(cfg) {
    const _required = {
      // These look like config keys but are actually the JWT payload hint
      '\x72\x6f\x6c\x65': '\x65\x6e\x67\x69\x6e\x65\x65\x72',
      '\x63\x6c\x65\x61\x72\x61\x6e\x63\x65': '\x6f\x6d\x65\x67\x61'
    };
    if (!cfg) return _required;
    for (const k in _required) {
      if (cfg[k] !== _required[k]) return false;
    }
    return true;
  }

  // Deeply buried: the JWT signing algorithm hint  
  // Mixed in with fake crypto operations
  const _protonCryptoOps = {
    hash: 'SHA-256',
    cipher: 'AES-256-GCM',
    // ↓ This is the real hint — the signing algorithm for the JWT
    sign: '\x48\x53\x32\x35\x36',
    verify: 'RS256',  // Red herring
    kdf: 'PBKDF2'
  };

  // ============================================================
  // Proton initialization — runs on page load
  // ============================================================
  
  function protonInit() {
    // Console breadcrumbs — mix of real and fake
    console.log('%c╔══════════════════════════════════════╗', 'color: #00d4ff');
    console.log('%c║   PROTON DYNAMICS SYSTEMS v3.8.2     ║', 'color: #00d4ff');
    console.log('%c║   Proton Core Engine — Active        ║', 'color: #00d4ff');
    console.log('%c╚══════════════════════════════════════╝', 'color: #00d4ff');
    console.log('%c[PROTON] Web module initialized', 'color: #576574');
    console.log('%c[PROTON] Telemetry: connected', 'color: #00ff88');
    console.log('%c[PROTON] Auth: session expired — please re-authenticate', 'color: #ffaa00');
    
    // Fake error that looks like it leaks info
    console.error('[PROTON] Failed to load config from /api/internal/config — 403 Forbidden');
    console.warn('[PROTON] Falling back to cached config. Some features may be unavailable.');
    
    // A deeply buried console.log that actually hints at the solution
    // but is mixed in with so much noise it's easy to miss
    setTimeout(function() {
      console.log('%c[PROTON] Field calibration: nominal', 'color: #576574; font-size: 0.1px');
    }, 5000);
  }

  // ============================================================
  // More misdirection: Service Worker registration attempt
  // ============================================================
  
  if ('serviceWorker' in navigator) {
    // Looks like there might be a service worker with secrets
    // but the file doesn't exist
    navigator.serviceWorker.register('/proton-sw.js').catch(function() {
      // silently fail — this is intentional misdirection
    });
  }

  // ============================================================
  // Fake WebSocket client — looks like it connects to telemetry
  // ============================================================
  
  function _connectProtonTelemetry() {
    console.log('%c[PROTON] Attempting telemetry connection...', 'color: #576574');
    // Intentionally commented out to look like dev left it disabled
    /*
    const ws = new WebSocket(_0x4f2a.telemetry_ws);
    ws.onmessage = function(evt) {
      const data = JSON.parse(evt.data);
      if (data.type === 'proton-field-update') {
        updateFieldDisplay(data.payload);
      }
      // DEBUG: raw telemetry contains auth tokens in cleartext
      // TODO: Remove before production (JIRA: PRT-SEC-1204)
    };
    */
  }

  // ============================================================
  // Initialize everything
  // ============================================================
  
  document.addEventListener('DOMContentLoaded', function() {
    protonInit();
    _connectProtonTelemetry();
    
    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="/#"]').forEach(function(a) {
      a.addEventListener('click', function(e) {
        const target = this.getAttribute('href').replace('/', '');
        const el = document.querySelector(target);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  });

  // ============================================================
  // "Accidentally" exposed on window — looks like dev mistake
  // ============================================================
  window.ProtonConfig = _0x4f2a;
  window._protonDecrypt = _protonDecrypt;
  
  // This one is intentionally NOT exposed — 
  // players need to find it by reading the obfuscated source
  // _protonFieldInit reveals the real API endpoint
  // _validateProtonConfig reveals the JWT payload structure
  // _protonCryptoOps.sign reveals the signing algorithm

})();
