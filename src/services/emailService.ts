import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    content: string;
    filename: string;
    type: string;
    disposition: string;
  }>;
}

export class EmailService {
  public static async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const msg = {
        to: options.to,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@yourdomain.com',
        subject: options.subject,
        text: options.text || '',
        html: options.html || '',
        attachments: options.attachments?.map(attachment => ({
          content: attachment.content,
          filename: attachment.filename,
          type: attachment.type,
          disposition: attachment.disposition
        }))
      };

      await sgMail.send(msg);
      console.log('Email sent successfully via SendGrid');
    } catch (error) {
      console.error('Error sending email via SendGrid:', error);
      throw error;
    }
  }

  public static async sendCplRequestEmail(
    to: string,
    veteranName: string,
    attachment?: Buffer
  ): Promise<void> {
    const subject = 'CPL Request Confirmation';
    const text = `Dear ${veteranName},\n\nWe have received your CPL request. Our team will review it and get back to you shortly.\n\nThank you for your patience.`;
    const html = `
      <h2>CPL Request Received</h2>
      <p>Dear ${veteranName},</p>
      <p>We have received your CPL request. Our team will review it and get back to you shortly.</p>
      <p>Thank you for your patience.</p>
    `;

    const emailOptions: EmailOptions = {
      to,
      subject,
      text,
      html,
    };

    if (attachment) {
      emailOptions.attachments = [{
        content: attachment.toString('base64'),
        filename: 'processed_document.pdf',
        type: 'application/pdf',
        disposition: 'attachment'
      }];
    }

    await this.sendEmail(emailOptions);
  }
}