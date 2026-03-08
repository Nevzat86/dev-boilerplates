/**
 * License key validation for monetizing your Chrome extension.
 *
 * Two approaches included:
 *
 * 1. ExtensionPay (extensionpay.com) — Easiest setup
 *    - Handles Stripe payments, license validation, and Chrome Web Store integration
 *    - Just call ExtPay('your-extension-id') and use extpay.getUser()
 *
 * 2. Custom license key validation — Full control
 *    - Validate against your own API endpoint
 *    - Use Gumroad's license verification API
 *    - Or implement offline validation with a signing scheme
 *
 * Usage:
 *   // Check if user has paid:
 *   const isPro = await license.isPro();
 *
 *   // Validate a license key (Gumroad):
 *   const valid = await license.validateGumroad('XXXX-XXXX-XXXX');
 *
 *   // Gate a feature:
 *   if (!await license.isPro()) {
 *     showUpgradePrompt();
 *     return;
 *   }
 */

import { storage } from './storage';

interface LicenseData {
  key: string;
  email?: string;
  validatedAt: number;
  plan: 'free' | 'pro' | 'lifetime';
}

export const license = {
  async isPro(): Promise<boolean> {
    const data = await storage.get<LicenseData>('license');
    if (!data) return false;

    // Re-validate every 7 days
    if (Date.now() - data.validatedAt > 7 * 24 * 60 * 60 * 1000) {
      const valid = await this.validateGumroad(data.key);
      return valid;
    }

    return data.plan !== 'free';
  },

  async validateGumroad(key: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.gumroad.com/v2/licenses/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          product_id: 'YOUR_GUMROAD_PRODUCT_ID', // TODO: Replace with your product ID
          license_key: key,
          increment_uses_count: 'false',
        }),
      });

      const data = await response.json();

      if (data.success) {
        await storage.set<LicenseData>('license', {
          key,
          email: data.purchase?.email,
          validatedAt: Date.now(),
          plan: data.purchase?.variants ? 'lifetime' : 'pro',
        });
        return true;
      }

      return false;
    } catch {
      // Offline: trust cached validation
      const cached = await storage.get<LicenseData>('license');
      return cached?.key === key && cached.plan !== 'free';
    }
  },

  async validateCustom(key: string, endpoint: string): Promise<boolean> {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseKey: key }),
      });

      const data = await response.json();

      if (data.valid) {
        await storage.set<LicenseData>('license', {
          key,
          email: data.email,
          validatedAt: Date.now(),
          plan: data.plan ?? 'pro',
        });
        return true;
      }

      return false;
    } catch {
      const cached = await storage.get<LicenseData>('license');
      return cached?.key === key && cached.plan !== 'free';
    }
  },

  async activate(key: string): Promise<boolean> {
    return this.validateGumroad(key);
  },

  async deactivate(): Promise<void> {
    await storage.remove('license');
  },

  async getLicense(): Promise<LicenseData | null> {
    return (await storage.get<LicenseData>('license')) ?? null;
  },
};
