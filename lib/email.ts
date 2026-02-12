import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

interface SendShareEmailParams {
  to: string
  documentName: string
  shareUrl: string
  senderName?: string
}

export async function sendShareEmail({ to, documentName, shareUrl, senderName }: SendShareEmailParams) {
  if (!resend) {
    console.log('[Email] Resend not configured. Share URL:', shareUrl)
    return { success: true, mock: true }
  }

  const { error } = await resend.emails.send({
    from: 'ContextWorks <onboarding@resend.dev>',
    to,
    subject: `Document for your review: ${documentName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body style="margin:0;padding:0;background-color:#ffffff;font-family:Inter,system-ui,sans-serif;">
        <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
          <div style="border:1px solid #e5e5e5;border-radius:8px;padding:40px;text-align:center;">
            <div style="margin-bottom:24px;">
              <span style="color:#09090B;font-weight:600;font-size:18px;">ContextWorks</span>
            </div>
            <h1 style="color:#09090B;font-size:20px;font-weight:600;margin:0 0 8px 0;">Document Ready for Review</h1>
            <p style="color:#737373;font-size:14px;line-height:1.6;margin:0 0 24px 0;">
              ${senderName ? `${senderName} has` : 'You have been'} shared a document that requires your review and signature.
            </p>
            <div style="background-color:#f5f5f5;border-radius:6px;padding:16px;margin-bottom:24px;">
              <p style="color:#737373;font-size:12px;margin:0 0 4px 0;">DOCUMENT</p>
              <p style="color:#09090B;font-size:16px;font-weight:500;margin:0;">${documentName}</p>
            </div>
            <a href="${shareUrl}" style="display:inline-block;background-color:#18181B;color:#FAFAFA;font-weight:500;font-size:14px;padding:10px 24px;border-radius:6px;text-decoration:none;">
              Review & Sign Document
            </a>
            <p style="color:#a3a3a3;font-size:12px;margin-top:24px;line-height:1.5;">
              This link will expire in 30 days. If you have questions, please contact your ContextWorks representative.
            </p>
          </div>
          <p style="color:#a3a3a3;font-size:11px;text-align:center;margin-top:16px;">
            &copy; ContextWorks. All rights reserved.
          </p>
        </div>
      </body>
      </html>
    `,
  })

  if (error) throw error
  return { success: true }
}
