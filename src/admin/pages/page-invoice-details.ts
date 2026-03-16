import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { AdminDataService } from '../services/admin-data.service.js';
import type { AdminInvoiceDetails } from '../services/admin-data.service.js';
import { adminEntityDetailPageStyles } from '../../styles/pages.js';

interface RouterLocation {
    params: Record<string, string>;
}

@customElement('admin-page-invoice-details')
export class PageInvoiceDetails extends LitElement {
    static styles = [adminEntityDetailPageStyles];

    @state() private invoice: AdminInvoiceDetails | null = null;
    @state() private loading = true;
    location?: RouterLocation;

    async onBeforeEnter(location: RouterLocation) {
        this.location = location;
        const id = location.params.id;
        if (id) {
            await this.fetchInvoice(id);
        }
    }

    private async fetchInvoice(id: string) {
        this.loading = true;
        try {
            const numericId = parseInt(id, 10);
            if (isNaN(numericId)) {
                console.error('Invalid invoice ID');
                this.invoice = null;
                return;
            }
            this.invoice = await AdminDataService.getInvoice(numericId);
        } catch (e) {
            console.error('Failed to load invoice', e);
        } finally {
            this.loading = false;
        }
    }

    render() {
        if (this.loading) {
            return html`<div class="loading-state">Loading invoice details...</div>`;
        }

        if (!this.invoice) {
            return html`
                <div class="empty-state">
                    <a href="/admin/accounts" class="back-btn">← Back to Accounts</a>
                    <div class="message">Invoice not found.</div>
                </div>
            `;
        }

        return html`
            <a href="javascript:history.back()" class="back-btn">← Back</a>
            
            <div class="header">
                <h1>
                    Invoice #${this.invoice.id}
                    <span class="status-badge status-${this.invoice.status.split(' ')[0]}">${this.invoice.status}</span>
                </h1>
                ${this.invoice.pdfUrl ? html`
                    <a href="${this.invoice.pdfUrl}" target="_blank" class="btn-primary">
                        Download PDF
                    </a>
                ` : ''}
            </div>

            <div class="meta">
                <div class="meta-item">
                    <label>Date</label>
                    <div class="value">${this.invoice.date}</div>
                </div>
                <div class="meta-item">
                    <label>Due Date</label>
                    <div class="value">${this.invoice.dueDate}</div>
                </div>
                <div class="meta-item">
                    <label>Balance Due</label>
                    <div class="value font-mono">$${this.invoice.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                </div>
                <div class="meta-item">
                    <label>Total Amount</label>
                    <div class="value font-mono">$${this.invoice.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                </div>
            </div>

            <h3 class="line-items-title">Line Items</h3>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Item Code</th>
                        <th>Description</th>
                        <th class="text-right">Qty</th>
                        <th class="text-right">Unit Price</th>
                        <th class="text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.invoice.lines.map(line => html`
                        <tr>
                            <td class="font-medium">${line.itemCode}</td>
                            <td>${line.description}</td>
                            <td class="text-right">${line.quantity}</td>
                            <td class="text-right font-mono">$${line.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                            <td class="text-right font-mono">$${line.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                        </tr>
                    `)}
                    ${this.invoice.lines.length === 0 ? html`<tr><td colspan="5" class="text-center">No line items found.</td></tr>` : ''}
                </tbody>
            </table>
        `;
    }
}
