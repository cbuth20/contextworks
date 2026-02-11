import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendSigningEmailParams {
  to: string
  clientName: string
  documentTitle: string
  shareUrl: string
}

export async function sendSigningEmail({ to, clientName, documentTitle, shareUrl }: SendSigningEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping email')
    return
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@contextworks.com'

  await resend.emails.send({
    from: `ContextWorks <${fromEmail}>`,
    to,
    subject: `Action Required: Please sign "${documentTitle}"`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F9FAFB;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F9FAFB; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 12px; border: 1px solid #E5E7EB; overflow: hidden;">
                <!-- Header -->
                <tr>
                  <td style="padding: 32px 40px 24px; border-bottom: 1px solid #E5E7EB;">
                    <strong style="font-size: 20px; color: #111827;">ContextWorks</strong>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding: 40px;">
                    <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 600; color: #111827;">
                      Document Ready for Signing
                    </h1>
                    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #6B7280;">
                      Hi ${clientName},
                    </p>
                    <p style="margin: 0 0 32px; font-size: 16px; line-height: 1.6; color: #6B7280;">
                      A document titled <strong style="color: #111827;">&ldquo;${documentTitle}&rdquo;</strong> has been shared with you for signing. Please review and sign it at your earliest convenience.
                    </p>

                    <!-- CTA Button -->
                    <table cellpadding="0" cellspacing="0" style="margin: 0 0 32px;">
                      <tr>
                        <td style="background: linear-gradient(135deg, #D4AF37 0%, #E6C766 100%); border-radius: 8px;">
                          <a href="${shareUrl}" style="display: inline-block; padding: 14px 32px; font-size: 16px; font-weight: 600; color: #FFFFFF; text-decoration: none;">
                            Review &amp; Sign Document
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 0; font-size: 14px; color: #9CA3AF;">
                      Or copy and paste this link into your browser:
                    </p>
                    <p style="margin: 4px 0 0; font-size: 14px; color: #D4AF37; word-break: break-all;">
                      ${shareUrl}
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 24px 40px; background-color: #F9FAFB; border-top: 1px solid #E5E7EB;">
                    <p style="margin: 0; font-size: 12px; color: #9CA3AF; line-height: 1.5;">
                      This link expires in 30 days. If you have any questions, please contact the sender directly.
                    </p>
                    <p style="margin: 8px 0 0; font-size: 12px; color: #9CA3AF;">
                      Sent via ContextWorks
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  })
}
