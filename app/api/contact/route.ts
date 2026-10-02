import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const incomingFormData = await request.formData();

    /*
     * Server-only Resend API key
     * NEVER use NEXT_PUBLIC_RESEND_API_KEY
     */
    const resendApiKey = process.env.RESEND_API_KEY;

    /*
     * Email address where contact messages will be received.
     *
     * Add this to .env.local:
     * CONTACT_TO_EMAIL=your@email.com
     */
    const toEmail = process.env.CONTACT_TO_EMAIL;

    if (!resendApiKey) {
      console.error('RESEND_API_KEY is missing.');

      return NextResponse.json(
        {
          success: false,
          message: 'Server configuration error.',
        },
        {
          status: 500,
        },
      );
    }

    if (!toEmail) {
      console.error('CONTACT_TO_EMAIL is missing.');

      return NextResponse.json(
        {
          success: false,
          message: 'Server email configuration error.',
        },
        {
          status: 500,
        },
      );
    }

    /*
     * Get form values
     */
    const name = incomingFormData.get('name');
    const email = incomingFormData.get('email');
    const whatsapp = incomingFormData.get('whatsapp');
    const message = incomingFormData.get('message');

    const subject = incomingFormData.get('subject');
    const fromName = incomingFormData.get('from_name');

    const botcheck = incomingFormData.get('botcheck');

    /*
     * Validation
     */
    if (!name || !String(name).trim()) {
      return NextResponse.json(
        {
          success: false,
          message: 'Name is required.',
        },
        {
          status: 400,
        },
      );
    }

    if (!email || !String(email).trim()) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email is required.',
        },
        {
          status: 400,
        },
      );
    }

    if (!whatsapp || !String(whatsapp).trim()) {
      return NextResponse.json(
        {
          success: false,
          message: 'WhatsApp number is required.',
        },
        {
          status: 400,
        },
      );
    }

    if (!message || !String(message).trim()) {
      return NextResponse.json(
        {
          success: false,
          message: 'Message is required.',
        },
        {
          status: 400,
        },
      );
    }

    if (String(message).trim().length < 15) {
      return NextResponse.json(
        {
          success: false,
          message: 'Message must contain at least 15 characters.',
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Honeypot
     */
    if (botcheck) {
      return NextResponse.json(
        {
          success: false,
          message: 'Spam submission detected.',
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Clean values
     */
    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim();
    const cleanWhatsapp = String(whatsapp).trim();
    const cleanMessage = String(message).trim();

    const emailSubject = subject
      ? String(subject).trim()
      : 'New Contact Message - easycsca';

    const senderName = fromName
      ? String(fromName).trim()
      : 'easycsca Website';

    /*
     * Send email using Resend
     *
     * IMPORTANT:
     * The API key stays on the server.
     */
    const resendResponse = await fetch(
      'https://api.resend.com/emails',
      {
        method: 'POST',

        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },

        body: JSON.stringify({
          /*
           * For testing you can use:
           * onboarding@resend.dev
           *
           * For production use a verified domain email.
           */
          from: `${senderName} <onboarding@resend.dev>`,

          to: [toEmail],

          subject: emailSubject,

          reply_to: cleanEmail,

          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>New Contact Message - easycsca</h2>

              <p>
                <strong>Name:</strong>
                ${escapeHtml(cleanName)}
              </p>

              <p>
                <strong>Email:</strong>
                ${escapeHtml(cleanEmail)}
              </p>

              <p>
                <strong>WhatsApp:</strong>
                ${escapeHtml(cleanWhatsapp)}
              </p>

              <p>
                <strong>Message:</strong>
              </p>

              <div
                style="
                  background: #f5f5f5;
                  padding: 15px;
                  border-radius: 8px;
                  white-space: pre-wrap;
                "
              >
                ${escapeHtml(cleanMessage)}
              </div>

              <hr />

              <p>
                <strong>Sent from:</strong> easycsca Website
              </p>
            </div>
          `,
        }),
      },
    );

    const responseText = await resendResponse.text();

    console.log(
      'Resend status:',
      resendResponse.status,
    );

    /*
     * Parse Resend response
     */
    let result: {
      id?: string;
      message?: string;
      name?: string;
      [key: string]: unknown;
    };

    try {
      result = JSON.parse(responseText);
    } catch {
      console.error(
        'Invalid Resend response:',
        responseText,
      );

      return NextResponse.json(
        {
          success: false,
          message: 'Invalid response received from email service.',
        },
        {
          status: 502,
        },
      );
    }

    /*
     * Resend error
     */
    if (!resendResponse.ok) {
      console.error(
        'Resend error:',
        result,
      );

      return NextResponse.json(
        {
          success: false,
          message:
            result.message ||
            'Email service rejected the submission.',
        },
        {
          status: 502,
        },
      );
    }

    /*
     * SUCCESS
     */
    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully.',
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      'Contact API error:',
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: 'Unable to send message from server.',
      },
      {
        status: 500,
      },
    );
  }
}

/*
 * Escape user input before putting it inside HTML email.
 */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}