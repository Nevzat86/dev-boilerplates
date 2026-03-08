/**
 * OAuth2 authentication flow for Chrome Extensions (MV3).
 *
 * Supports two patterns:
 * 1. Google OAuth via chrome.identity.getAuthToken (Google APIs only)
 * 2. Generic OAuth2 via chrome.identity.launchWebAuthFlow (any provider)
 *
 * Setup:
 * - Add "identity" to manifest permissions
 * - Add "oauth2" config to manifest for Google OAuth
 * - For generic OAuth2, configure your provider's redirect URI to:
 *   https://<extension-id>.chromiumapp.org/
 *
 * Usage:
 *   // Google OAuth:
 *   const token = await googleAuth.getToken();
 *   await googleAuth.revokeToken();
 *
 *   // Generic OAuth2 (GitHub, Discord, etc.):
 *   const token = await genericOAuth.authenticate({
 *     authUrl: 'https://github.com/login/oauth/authorize',
 *     clientId: 'your-client-id',
 *     scopes: ['read:user', 'repo'],
 *     tokenUrl: 'https://github.com/login/oauth/access_token',
 *     clientSecret: 'your-secret', // Only if required; prefer PKCE
 *   });
 */

import { storage } from './storage';

// --- Google OAuth (chrome.identity) ---

export const googleAuth = {
  async getToken(interactive = true): Promise<string | null> {
    return new Promise((resolve) => {
      chrome.identity.getAuthToken({ interactive }, (token) => {
        if (chrome.runtime.lastError) {
          resolve(null);
          return;
        }
        resolve(token ?? null);
      });
    });
  },

  async revokeToken(): Promise<void> {
    const token = await this.getToken(false);
    if (!token) return;

    await fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`);
    return new Promise((resolve) => {
      chrome.identity.removeCachedAuthToken({ token }, resolve);
    });
  },
};

// --- Generic OAuth2 (any provider) ---

interface OAuthConfig {
  authUrl: string;
  clientId: string;
  scopes: string[];
  tokenUrl?: string;
  clientSecret?: string;
}

interface TokenData {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

export const genericOAuth = {
  async authenticate(config: OAuthConfig): Promise<TokenData | null> {
    const redirectUri = chrome.identity.getRedirectURL();
    const state = crypto.randomUUID();

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: redirectUri,
      response_type: config.tokenUrl ? 'code' : 'token',
      scope: config.scopes.join(' '),
      state,
    });

    const authFlowUrl = `${config.authUrl}?${params.toString()}`;

    const responseUrl = await new Promise<string | undefined>((resolve) => {
      chrome.identity.launchWebAuthFlow(
        { url: authFlowUrl, interactive: true },
        resolve,
      );
    });

    if (!responseUrl) return null;

    const url = new URL(responseUrl);

    // Implicit flow — token in hash
    if (!config.tokenUrl) {
      const hashParams = new URLSearchParams(url.hash.slice(1));
      const accessToken = hashParams.get('access_token');
      if (!accessToken) return null;

      const tokenData: TokenData = {
        accessToken,
        expiresAt: hashParams.get('expires_in')
          ? Date.now() + Number(hashParams.get('expires_in')) * 1000
          : undefined,
      };
      await storage.set('oauth_token', tokenData);
      return tokenData;
    }

    // Authorization code flow — exchange code for token
    const code = url.searchParams.get('code');
    if (!code) return null;

    const tokenResponse = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenJson = await tokenResponse.json();
    const tokenData: TokenData = {
      accessToken: tokenJson.access_token,
      refreshToken: tokenJson.refresh_token,
      expiresAt: tokenJson.expires_in
        ? Date.now() + tokenJson.expires_in * 1000
        : undefined,
    };

    await storage.set('oauth_token', tokenData);
    return tokenData;
  },

  async getStoredToken(): Promise<TokenData | null> {
    const token = await storage.get<TokenData>('oauth_token');
    if (!token) return null;

    if (token.expiresAt && Date.now() > token.expiresAt) {
      await storage.remove('oauth_token');
      return null;
    }

    return token;
  },

  async logout(): Promise<void> {
    await storage.remove('oauth_token');
  },
};
