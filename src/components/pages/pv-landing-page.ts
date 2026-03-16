/**
 * PvLandingPage - Branded entry point for portal demos
 */

import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { PvBase } from '../pv-base.js';
import { RouterService } from '../../services/router.service.js';

@customElement('pv-landing-page')
export class PvLandingPage extends PvBase {
  static styles = [
    ...PvBase.styles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        width: 100%;
        background: linear-gradient(135deg, #1d231c 0%, #121612 100%);
        color: #ffffff;
        font-family: 'Inter', sans-serif;
        box-sizing: border-box;
      }

      .password-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--app-login-bg, linear-gradient(135deg, #1d231c 0%, #121612 100%));
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 2rem;
        box-sizing: border-box;
      }

      .password-card {
        background: white;
        padding: 3rem;
        border-radius: 20px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        max-width: 400px;
        width: 100%;
        text-align: center;
        animation: cardIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      }

      @keyframes cardIn {
        from { opacity: 0; transform: scale(0.9) translateY(20px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
      }

      .password-logo {
        height: 100px;
        margin-bottom: 2rem;
        margin-inline: auto;
      }

      .password-card h2 {
        font-family: 'Space Grotesk', sans-serif;
        color: #1d231c;
        margin-bottom: 1rem;
        font-size: 24px;
      }

      .password-card p {
        color: #64748b;
        margin-bottom: 2rem;
        font-size: 14px;
      }

      .input-group {
        position: relative;
        margin-bottom: 1.5rem;
      }

      .password-input {
        width: 100%;
        padding: 1rem 1.5rem;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        font-size: 16px;
        outline: none;
        transition: border-color 0.2s;
      }

      .password-input:focus {
        border-color: #6a011f;
      }

      .btn-auth {
        width: 100%;
        background: #cc0000;
        color: white;
        padding: 1rem;
        border-radius: 12px;
        font-weight: 700;
        font-size: 16px;
        transition: all 0.2s;
        border: none;
        cursor: pointer;
      }

      .btn-auth:hover {
        background: #990000;
        transform: translateY(-2px);
      }

      .auth-error {
        color: #ef4444;
        font-size: 13px;
        margin-top: 1rem;
        font-weight: 500;
      }

      .landing-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 1000px;
        width: 100%;
        margin: 0 auto;
        text-align: center;
        animation: fadeIn 0.8s ease-out;
        padding-top: 15vh;
        padding-bottom: 4rem;
        padding-left: 2rem;
        padding-right: 2rem;
        box-sizing: border-box;
        flex: 1;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .logo-container {
        margin-bottom: var(--space-2xl);
        display: flex;
        justify-content: center;
      }

      .rycenga-logo {
        height: 180px;
        width: auto;
        max-width: 100%;
      }

      .title {
        font-size: 24px;
        font-weight: 700;
        letter-spacing: 0.1em;
        color: #ffffff;
        margin-bottom: var(--space-3xl);
        text-transform: uppercase;
      }

      .portal-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: var(--space-2xl);
        margin-bottom: var(--space-3xl);
      }

      .portal-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: var(--space-2xl);
        text-align: left;
        transition: all 0.3s ease;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .portal-card:hover {
        border-color: var(--color-accent);
        transform: translateY(-4px);
        background: #f8fafc;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }

      .card-title {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: var(--space-md);
        color: #0f172a;
      }

      .card-description {
        font-size: 14px;
        color: #475569;
        line-height: 1.6;
        margin-bottom: var(--space-xl);
        flex-grow: 1;
      }

      .card-link {
        font-size: 14px;
        font-weight: 600;
        color: var(--color-accent);
        display: flex;
        align-items: center;
        gap: 8px;
        text-decoration: none;
      }

      .footer {
        font-size: 12px;
        color: #94a3b8;
        margin-top: var(--space-2xl);
      }

      .footer a {
        color: #dc2626; /* BuilderWire red */
        font-weight: 600;
        text-decoration: none;
      }
      .footer a:hover {
        text-decoration: underline;
      }


      @media (max-width: 640px) {
        .portal-cards {
          grid-template-columns: 1fr;
        }
      }
    `,
  ];

  @state() private isAuthorized = false;
  @state() private passwordInput = '';
  @state() private authError = '';

  connectedCallback() {
    super.connectedCallback();
    const auth = localStorage.getItem('redriver_auth');
    if (auth === 'true') {
      this.isAuthorized = true;
    }
  }

  private handlePasswordInput(e: Event) {
    this.passwordInput = (e.target as HTMLInputElement).value;
    this.authError = '';
  }

  private checkPassword() {
    if (this.passwordInput === 'HowMartinsWins2026') {
      this.isAuthorized = true;
      localStorage.setItem('redriver_auth', 'true');
    } else {
      this.authError = 'Incorrect password. Please try again.';
      this.passwordInput = '';
    }
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.checkPassword();
    }
  }

  private navigateToPortal() {
    sessionStorage.removeItem('demo_modal_dismissed_customer');
    RouterService.navigate('overview');
  }

  private navigateToAdmin() {
    sessionStorage.removeItem('demo_modal_dismissed_admin');
    window.location.assign('/admin');
  }

  render() {
    if (!this.isAuthorized) {
      return html`
        <div class="password-overlay">
          <div class="password-card">
            <img src="/assets/redriver-logo.png" alt="Logo" class="password-logo" />
            <h2>Restricted Access</h2>
            <p>Please enter the authorization password to view the Red River Lumber portals.</p>
            <div class="input-group">
              <input 
                type="password" 
                class="password-input" 
                placeholder="Enter password"
                .value=${this.passwordInput}
                @input=${this.handlePasswordInput}
                @keydown=${this.handleKeyDown}
                autofocus
              />
            </div>
            <button class="btn-auth" @click=${this.checkPassword}>
              Authorize Access
            </button>
            ${this.authError ? html`<div class="auth-error">${this.authError}</div>` : ''}
          </div>
        </div>
      `;
    }

    return html`
      <div class="landing-container">
        <div class="logo-container">
          <img src="/assets/redriver-logo.png" alt="Red River Lumber Logo" class="rycenga-logo" />
        </div>

        <h1 class="title">Red River Lumber</h1>

        <div class="portal-cards">
          <div class="portal-card" @click=${this.navigateToPortal}>
            <div>
              <h2 class="card-title">Customer Portal</h2>
              <p class="card-description">
                Account overview dashboard, billing and invoice payments, saved payment methods, 
                quote conversion, AI-powered Quick Quoting, document management and sharing, team management, and account settings.
              </p>
            </div>
            <div class="card-link">
              Enter Portal <span>&rarr;</span>
            </div>
          </div>

          <div class="portal-card" @click=${this.navigateToAdmin}>
            <div>
              <h2 class="card-title">Admin / AR Center</h2>
              <p class="card-description">
                Admin dashboard, account and user management, document management and sharing, invoice/order/quote details, 
                messaging, and the AR Center with payment requests and automations.
              </p>
            </div>
            <div class="card-link">
              Enter Admin <span>&rarr;</span>
            </div>
          </div>
        </div>


        <div class="footer">
          Powered by <a href="https://builderwire.com" target="_blank" rel="noopener noreferrer">BuilderWire</a>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pv-landing-page': PvLandingPage;
  }
}
