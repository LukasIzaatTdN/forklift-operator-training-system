import { Certificate, UserRole } from '../types';

export const CERTIFICATE_VALIDITY_MONTHS = 12;

export function addMonths(timestamp: number, months: number): number {
  const date = new Date(timestamp);
  date.setMonth(date.getMonth() + months);
  return date.getTime();
}

export function getCertificateValidUntil(certificate: Certificate): number {
  return certificate.validUntil || addMonths(certificate.issuedAt, CERTIFICATE_VALIDITY_MONTHS);
}

export function isCertificateExpired(certificate: Certificate): boolean {
  return Date.now() > getCertificateValidUntil(certificate);
}

export function getCertificateStatusLabel(certificate: Certificate): string {
  return isCertificateExpired(certificate) ? 'Vencido' : 'Válido';
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

interface PrintCertificateParams {
  certificate: Certificate;
  operatorName: string;
  operatorRole: UserRole;
}

function printViaHiddenIframe(html: string): boolean {
  if (typeof document === 'undefined') return false;

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.setAttribute('aria-hidden', 'true');

  const cleanup = () => {
    window.setTimeout(() => {
      iframe.remove();
    }, 800);
  };

  iframe.onload = () => {
    const frameWindow = iframe.contentWindow;
    if (!frameWindow) {
      cleanup();
      return;
    }

    frameWindow.focus();
    frameWindow.print();
    cleanup();
  };

  document.body.appendChild(iframe);

  const frameDoc = iframe.contentDocument;
  if (!frameDoc) {
    cleanup();
    return false;
  }

  frameDoc.open();
  frameDoc.write(html);
  frameDoc.close();
  return true;
}

export function printCertificateAsPdf({ certificate, operatorName, operatorRole }: PrintCertificateParams): void {
  if (typeof window === 'undefined') return;

  const issueDate = new Date(certificate.issuedAt).toLocaleDateString('pt-BR');
  const validUntil = new Date(getCertificateValidUntil(certificate)).toLocaleDateString('pt-BR');

  const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<title>Certificado - ${escapeHtml(certificate.trackTitle)}</title>
<style>
  @page { size: A4 landscape; margin: 0; }
  body { margin: 0; font-family: Arial, sans-serif; background: #f7f7f7; }
  .wrap { width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; }
  .cert {
    width: 1100px;
    max-width: 94vw;
    background: white;
    border: 14px solid #1d4ed8;
    border-radius: 24px;
    padding: 48px;
    box-sizing: border-box;
    color: #0f172a;
  }
  .brand { text-align: center; color: #1d4ed8; font-size: 20px; font-weight: 700; letter-spacing: 1px; }
  h1 { text-align: center; margin: 14px 0 8px; font-size: 50px; }
  .subtitle { text-align: center; color: #334155; font-size: 18px; margin-bottom: 26px; }
  .name { text-align: center; font-size: 42px; font-weight: 700; margin: 14px 0; color: #0b3b91; }
  .block { text-align: center; font-size: 20px; line-height: 1.6; }
  .meta { margin-top: 34px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 18px; font-size: 16px; color: #334155; }
  .meta div { border: 1px solid #cbd5e1; border-radius: 12px; padding: 10px; background: #f8fafc; }
  .foot { margin-top: 26px; text-align: center; font-size: 13px; color: #64748b; }
</style>
</head>
<body>
  <div class="wrap">
    <section class="cert">
      <div class="brand">EMPILHAPRO | SISTEMA DE TREINAMENTO</div>
      <h1>CERTIFICADO</h1>
      <p class="subtitle">Certificamos que o(a) operador(a) concluiu a trilha de treinamento com aprovação.</p>
      <div class="name">${escapeHtml(operatorName)}</div>
      <div class="block">
        <div>Trilha: <strong>${escapeHtml(certificate.trackTitle)}</strong></div>
        <div>Perfil: <strong>${escapeHtml(operatorRole)}</strong></div>
        <div>Nota final: <strong>${certificate.finalScore}%</strong></div>
      </div>
      <div class="meta">
        <div><strong>Data de emissão</strong><br />${issueDate}</div>
        <div><strong>Válido até</strong><br />${validUntil}</div>
        <div><strong>Código do certificado</strong><br />${escapeHtml(certificate.id)}</div>
      </div>
      <div class="foot">Para salvar em PDF: impressão > destino "Salvar como PDF".</div>
    </section>
  </div>
<script>window.onload = () => { window.focus(); window.print(); };</script>
</body>
</html>`;

  if (printViaHiddenIframe(html)) return;

  const view = window.open('', '_blank', 'noopener,noreferrer,width=1280,height=900');
  if (view) {
    view.document.open();
    view.document.write(html);
    view.document.close();
    return;
  }

  window.alert('Não foi possível abrir a impressão do certificado. Libere pop-up para este site e tente novamente.');
}
