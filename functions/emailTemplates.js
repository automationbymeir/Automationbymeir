const getEmailTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
        body { margin: 0; padding: 0; width: 100% !important; min-width: 100%; background-color: #1E1E21; font-family: 'IBM Plex Sans', sans-serif; }
        a { color: #00e676; text-decoration: none; }
        @media only screen and (max-width: 600px) {
            .container { width: 100% !important; }
            .content-padding { padding: 20px !important; }
            .button { width: 100% !important; max-width: 300px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #1E1E21; color: #ffffff;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #1E1E21;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table class="container" role="presentation" cellpadding="0" cellspacing="0" width="600" style="background-color: #252529; border-radius: 12px; overflow: hidden; border: 1px solid #333333; box-shadow: 0 4px 20px rgba(0,0,0,0.4);">
                    <tr>
                        <td style="padding: 0;">
                            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="background-color: #00e676; height: 4px;"></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 40px 20px 30px; background-color: #252529;">
                            <table role="presentation" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center">
                                        <a href="https://automationbymeir.web.app" target="_blank" style="text-decoration: none;">
                                            <img src="https://automationbymeir.web.app/ma_logo.png" alt="Automations by Meir" width="180" style="display: block; font-family: 'IBM Plex Sans', sans-serif; color: #ffffff; font-size: 20px; border: 0; max-width: 100%; height: auto;">
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td class="content-padding" style="padding: 0 40px 40px;">
                            ${content}
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #2A2A2E; padding: 30px 40px; border-top: 1px solid #333333;">
                            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" style="font-family: 'IBM Plex Sans', sans-serif; font-size: 14px; color: #888888; line-height: 1.6;">
                                        <p style="margin: 0 0 10px 0;">© 2025 Automations by Meir. All rights reserved.</p>
                                        <p style="margin: 0;">Transform Your Business with Intelligent Automation</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

const createNotificationEmailContent = (data, timezone, meetingDurationMinutes) => {
  const formattedDate = new Date(data.dateTime).toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: timezone,
  });

  const meetButton = data.meetLink
    ? `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding: 20px 0;">
          <a href="${data.meetLink}" style="display: inline-block; padding: 12px 32px; background-color: #ffffff; color: #000000; font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; font-weight: 500; text-decoration: none; border-radius: 8px;">
            Join Google Meet
          </a>
        </td>
      </tr>
    </table>`
    : '';

  return `
    <h1 style="font-family: 'IBM Plex Sans', sans-serif; font-size: 28px; font-weight: 300; color: #ffffff; margin: 0 0 20px 0; text-align: center;">
      New Consultation Scheduled! 🎉
    </h1>
    
    <div style="background-color: #1E1E21; border: 1px solid #333333; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="padding-bottom: 12px;">
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-family: 'IBM Plex Sans', sans-serif; font-size: 14px; color: #888888; width: 80px;">Client:</td>
                <td style="font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; color: #ffffff; font-weight: 600;">${data.name}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom: 12px;">
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-family: 'IBM Plex Sans', sans-serif; font-size: 14px; color: #888888; width: 80px;">Email:</td>
                <td style="font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; color: #00e676;">
                  <a href="mailto:${data.email}" style="color: #00e676; text-decoration: none;">${data.email}</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td>
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-family: 'IBM Plex Sans', sans-serif; font-size: 14px; color: #888888; width: 80px;">Time:</td>
                <td style="font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; color: #ffffff; font-weight: 400;">${formattedDate} · ${meetingDurationMinutes} min</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
    
    ${meetButton}
    
    <div style="margin-bottom: 24px;">
      <h2 style="font-family: 'IBM Plex Sans', sans-serif; font-size: 20px; font-weight: 300; color: #ffffff; margin: 0 0 16px 0; padding-bottom: 8px; border-bottom: 1px solid #333333;">
        Project Details
      </h2>
      <div style="background-color: #1E1E21; border: 1px solid #333333; border-radius: 8px; padding: 20px;">
        <p style="font-family: 'IBM Plex Sans', sans-serif; font-size: 15px; color: #C4C4C4; margin: 0; white-space: pre-wrap; line-height: 1.6;">
          ${data.details}
        </p>
      </div>
    </div>
    
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding-top: 20px;">
          <a href="https://calendar.google.com" style="display: inline-block; padding: 12px 32px; background: transparent; color: #ffffff; font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; font-weight: 300; text-decoration: none; border: 1px solid #ffffff; border-radius: 8px;">
            View in Calendar
          </a>
        </td>
      </tr>
    </table>`;
};

const createEnglishEmailContent = (data, timezone, meetingDurationMinutes) => {
  const formattedDate = new Date(data.dateTime).toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: timezone,
  });

  const meetSection = data.meetLink
    ? `
    <tr>
      <td style="font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; color: #ffffff; padding-top: 16px;">
        <strong style="color: #00e676; font-weight: 500;">💻 Meeting Link:</strong><br>
        <a href="${data.meetLink}" style="color: #00e676; text-decoration: none;">Join Google Meet</a>
      </td>
    </tr>`
    : '';

  return `
    <h1 style="font-family: 'IBM Plex Sans', sans-serif; font-size: 28px; font-weight: 300; color: #ffffff; margin: 0 0 20px 0;">
      Hi ${data.name},
    </h1>
    
    <p style="font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; color: #C4C4C4; line-height: 1.6; margin: 0 0 24px 0;">
      Thank you for reaching out! I'm excited to discuss your project and explore how we can transform your business with intelligent automation.
    </p>
    
    <div style="background-color: #1E1E21; border: 1px solid #333333; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
      <h2 style="font-family: 'IBM Plex Sans', sans-serif; font-size: 20px; font-weight: 300; color: #ffffff; margin: 0 0 16px 0;">
        Meeting Details
      </h2>
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; color: #C4C4C4;">
            <strong style="color: #ffffff; font-weight: 500;">📅 Date & Time:</strong><br>
            ${formattedDate} (${timezone})
          </td>
        </tr>
        <tr>
          <td style="font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; color: #C4C4C4; padding-top: 12px;">
            <strong style="color: #ffffff; font-weight: 500;">⏱️ Duration:</strong><br>
            ${meetingDurationMinutes} minutes
          </td>
        </tr>
        ${meetSection}
      </table>
    </div>
    
    ${data.meetLink
      ? `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding-bottom: 24px;">
          <a href="${data.meetLink}" style="display: inline-block; padding: 14px 36px; background-color: #ffffff; color: #000000; font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; font-weight: 500; text-decoration: none; border-radius: 8px;">
            Join Google Meet
          </a>
        </td>
      </tr>
    </table>`
      : ''}
    
    <div style="background-color: #1E1E21; border: 1px solid #333333; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
      <h3 style="font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; font-weight: 500; color: #ffffff; margin: 0 0 12px 0;">
        Your Project Details:
      </h3>
      <p style="font-family: 'IBM Plex Sans', sans-serif; font-size: 14px; color: #C4C4C4; margin: 0; white-space: pre-wrap; line-height: 1.6;">
        ${data.details}
      </p>
    </div>
    
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center">
          <p style="font-family: 'IBM Plex Sans', sans-serif; font-size: 14px; color: #888888; margin: 0 0 20px 0;">
            A calendar invitation has been sent to your email.
          </p>
        </td>
      </tr>
    </table>
    
    <div style="text-align: center; padding-top: 20px; border-top: 1px solid #333333;">
      <p style="font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; color: #C4C4C4; margin: 0;">
        Looking forward to speaking with you!
      </p>
      <p style="font-family: 'IBM Plex Sans', sans-serif; font-size: 18px; color: #ffffff; margin: 10px 0 0 0; font-weight: 600;">
        Meir Horwitz
      </p>
    </div>`;
};

const createHebrewEmailContent = (data, timezone, meetingDurationMinutes) => {
  const formattedDate = new Date(data.dateTime).toLocaleString('he-IL', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: timezone,
  });

  const meetSection = data.meetLink
    ? `
    <tr>
      <td style="font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; color: #ffffff; padding-top: 16px; text-align: right;">
        <strong style="color: #00e676; font-weight: 500;">💻 קישור לפגישה:</strong><br>
        <a href="${data.meetLink}" style="color: #00e676; text-decoration: none;">הצטרף ל-Google Meet</a>
      </td>
    </tr>`
    : '';

  return `
    <div dir="rtl" style="text-align: right;">
      <h1 style="font-family: 'IBM Plex Sans', sans-serif; font-size: 28px; font-weight: 300; color: #ffffff; margin: 0 0 20px 0;">
        שלום ${data.name},
      </h1>
      
      <p style="font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; color: #C4C4C4; line-height: 1.8; margin: 0 0 24px 0;">
        תודה על פנייתך! אני נרגש לדון בפרויקט שלך ולחקור כיצד נוכל לשנות את העסק שלך עם אוטומציה חכמה.
      </p>
      
      <div style="background-color: #1E1E21; border: 1px solid #333333; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
        <h2 style="font-family: 'IBM Plex Sans', sans-serif; font-size: 20px; font-weight: 300; color: #ffffff; margin: 0 0 16px 0;">
          פרטי הפגישה
        </h2>
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; color: #C4C4C4; text-align: right;">
              <strong style="color: #ffffff; font-weight: 500;">📅 תאריך ושעה:</strong><br>
              ${formattedDate} (${timezone})
            </td>
          </tr>
          <tr>
            <td style="font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; color: #C4C4C4; padding-top: 12px; text-align: right;">
              <strong style="color: #ffffff; font-weight: 500;">⏱️ משך הפגישה:</strong><br>
              ${meetingDurationMinutes} דקות
            </td>
          </tr>
          ${meetSection}
        </table>
      </div>
      
      ${data.meetLink
      ? `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" style="padding-bottom: 24px;">
            <a href="${data.meetLink}" style="display: inline-block; padding: 14px 36px; background-color: #ffffff; color: #000000; font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; font-weight: 500; text-decoration: none; border-radius: 8px;">
              הצטרף ל-Google Meet
            </a>
          </td>
        </tr>
      </table>`
      : ''}
      
      <div style="background-color: #1E1E21; border: 1px solid #333333; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
        <h3 style="font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; font-weight: 500; color: #ffffff; margin: 0 0 12px 0;">
          פרטי הפרויקט שלך:
        </h3>
        <p style="font-family: 'IBM Plex Sans', sans-serif; font-size: 14px; color: #C4C4C4; margin: 0; white-space: pre-wrap; line-height: 1.8;">
          ${data.details}
        </p>
      </div>
      
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center">
            <p style="font-family: 'IBM Plex Sans', sans-serif; font-size: 14px; color: #888888; margin: 0 0 20px 0;">
              הזמנה לאירוע ביומן נשלחה למייל שלך.
            </p>
          </td>
        </tr>
      </table>
      
      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #333333;">
        <p style="font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; color: #C4C4C4; margin: 0;">
          מצפה לדבר איתך!
        </p>
        <p style="font-family: 'IBM Plex Sans', sans-serif; font-size: 18px; color: #ffffff; margin: 10px 0 0 0; font-weight: 600;">
          מאיר הורביץ
        </p>
      </div>
    </div>`;
};

const createBriefConfirmationEmailContent = (data) => {
  return `
    <h1 style="font-family: 'IBM Plex Sans', sans-serif; font-size: 28px; font-weight: 300; color: #ffffff; margin: 0 0 20px 0;">
      Hi ${data.name},
    </h1>
    
    <p style="font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; color: #C4C4C4; line-height: 1.6; margin: 0 0 24px 0;">
      Thank you for submitting your project brief! We've received your request and are excited to learn more about your automation needs.
    </p>
    
    <div style="background-color: #1E1E21; border: 1px solid #333333; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
      <h2 style="font-family: 'IBM Plex Sans', sans-serif; font-size: 20px; font-weight: 300; color: #ffffff; margin: 0 0 16px 0;">
        What Happens Next?
      </h2>
      <p style="font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; color: #C4C4C4; line-height: 1.6; margin: 0;">
        Our team will carefully review your brief and get back to you with a customized offer within <strong style="color: #00e676;">1-3 business days</strong>. We'll provide you with:
      </p>
      <ul style="font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; color: #C4C4C4; line-height: 1.8; margin: 16px 0 0 0; padding-left: 24px;">
        <li>A detailed proposal tailored to your requirements</li>
        <li>Timeline and delivery estimates</li>
        <li>Pricing information</li>
        <li>Next steps to get started</li>
      </ul>
    </div>
    
    <div style="background-color: #1E1E21; border: 1px solid #333333; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
      <h3 style="font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; font-weight: 500; color: #ffffff; margin: 0 0 12px 0;">
        Your Project Brief:
      </h3>
      <p style="font-family: 'IBM Plex Sans', sans-serif; font-size: 14px; color: #C4C4C4; margin: 0; white-space: pre-wrap; line-height: 1.6;">
        ${data.brief}
      </p>
    </div>
    
    <div style="text-align: center; padding-top: 20px; border-top: 1px solid #333333;">
      <p style="font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; color: #C4C4C4; margin: 0;">
        We're looking forward to working with you!
      </p>
      <p style="font-family: 'IBM Plex Sans', sans-serif; font-size: 18px; color: #ffffff; margin: 10px 0 0 0; font-weight: 600;">
        Meir Horwitz
      </p>
      <p style="font-family: 'IBM Plex Sans', sans-serif; font-size: 14px; color: #888888; margin: 5px 0 0 0;">
        Automation by Meir
      </p>
    </div>`;
};

const createBriefNotificationEmailContent = (data, hasAttachments) => {
  const attachmentsNote = hasAttachments
    ? `<tr>
        <td style="font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; color: #ffffff; padding-top: 12px;">
          <strong style="color: #00e676;">📎 Attachments:</strong><br>
          <span style="color: #C4C4C4;">${data.attachmentCount} file(s) attached to this email</span>
        </td>
      </tr>`
    : '';

  return `
    <h1 style="font-family: 'IBM Plex Sans', sans-serif; font-size: 28px; font-weight: 300; color: #ffffff; margin: 0 0 20px 0; text-align: center;">
      New Custom Project Brief Received! 🎉
    </h1>
    
    <div style="background-color: #1E1E21; border: 1px solid #333333; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="padding-bottom: 12px;">
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-family: 'IBM Plex Sans', sans-serif; font-size: 14px; color: #888888; width: 80px;">Client:</td>
                <td style="font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; color: #ffffff; font-weight: 600;">${data.name}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom: 12px;">
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-family: 'IBM Plex Sans', sans-serif; font-size: 14px; color: #888888; width: 80px;">Email:</td>
                <td style="font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; color: #00e676;">
                  <a href="mailto:${data.email}" style="color: #00e676; text-decoration: none;">${data.email}</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        ${attachmentsNote}
      </table>
    </div>
    
    <div style="margin-bottom: 24px;">
      <h2 style="font-family: 'IBM Plex Sans', sans-serif; font-size: 20px; font-weight: 300; color: #ffffff; margin: 0 0 16px 0; padding-bottom: 8px; border-bottom: 1px solid #333333;">
        Project Brief
      </h2>
      <div style="background-color: #1E1E21; border: 1px solid #333333; border-radius: 8px; padding: 20px;">
        <p style="font-family: 'IBM Plex Sans', sans-serif; font-size: 15px; color: #C4C4C4; margin: 0; white-space: pre-wrap; line-height: 1.6;">
          ${data.brief}
        </p>
      </div>
    </div>
    
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding-top: 20px;">
          <p style="font-family: 'IBM Plex Sans', sans-serif; font-size: 14px; color: #888888; margin: 0;">
            Please review the brief and respond with a customized offer within 1-3 business days.
          </p>
        </td>
      </tr>
    </table>`;
};

const createChecklistEmailContent = () => {
  const items = [
    { title: "Identify Repetitive Data Entry", desc: "Any task where you copy-paste between spreadsheets, emails, or systems is a prime automation candidate." },
    { title: "Map Your Email Workflows", desc: "Track how many routine emails you send daily &mdash; follow-ups, confirmations, status updates &mdash; these can all be automated." },
    { title: "Audit Your Report Generation", desc: "Weekly/monthly reports that pull data from multiple sources are perfect for automated dashboards." },
    { title: "Review Document Creation Processes", desc: "Proposals, invoices, contracts &mdash; if you&rsquo;re using templates and changing fields manually, automate it." },
    { title: "Check Your Onboarding Flow", desc: "Client or employee onboarding with multiple steps (forms, emails, access setup) should be a single automated flow." },
    { title: "Evaluate Calendar &amp; Scheduling Tasks", desc: "Manual meeting coordination and availability checks can be replaced with smart scheduling systems." },
    { title: "Inventory Your File Management", desc: "Organizing, renaming, moving files into folder structures &mdash; let automation handle your Google Drive housekeeping." },
    { title: "Look for Approval Bottlenecks", desc: "Multi-step approval chains that stall in email inboxes can be streamlined with automated routing and notifications." },
    { title: "Assess AI Opportunities", desc: "Content drafting, data analysis, categorization &mdash; AI can handle these at 100x speed with minimal oversight." },
    { title: "Calculate Your Time Investment", desc: "For each item above, estimate hours/week spent. Multiply by your hourly rate &mdash; that&rsquo;s your automation ROI potential." },
  ];

  const itemsHtml = items.map((item, i) => {
    const isLast = i === items.length - 1;
    const numStyle = isLast
      ? 'background: linear-gradient(135deg, #00e676, #00b0ff); color: #000000;'
      : 'background-color: rgba(0, 230, 118, 0.15); color: #00e676;';
    return `<tr><td style="padding-bottom: ${isLast ? '0' : '20'}px;">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td style="width: 36px; height: 36px; ${numStyle} border-radius: 8px; text-align: center; vertical-align: middle; font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; font-weight: 600;">${i + 1}</td>
        <td style="padding-left: 14px;">
          <span style="font-family: 'IBM Plex Sans', sans-serif; font-size: 15px; color: #ffffff; font-weight: 500;">${item.title}</span><br>
          <span style="font-family: 'IBM Plex Sans', sans-serif; font-size: 13px; color: #888888;">${item.desc}</span>
        </td>
      </tr></table>
    </td></tr>`;
  }).join('\n');

  return `
    <h1 style="font-family: 'IBM Plex Sans', sans-serif; font-size: 28px; font-weight: 300; color: #ffffff; margin: 0 0 8px 0; text-align: center;">
      Your 10-Point Automation Checklist
    </h1>
    <p style="font-family: 'IBM Plex Sans', sans-serif; font-size: 15px; color: #888888; text-align: center; margin: 0 0 28px 0;">
      Discover which processes to automate first for maximum ROI
    </p>
    <div style="background-color: #1E1E21; border: 1px solid #333333; border-radius: 12px; padding: 28px; margin-bottom: 24px;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        ${itemsHtml}
      </table>
    </div>
    <div style="background: linear-gradient(135deg, rgba(0, 230, 118, 0.1), rgba(0, 176, 255, 0.1)); border: 1px solid rgba(0, 230, 118, 0.3); border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
      <p style="font-family: 'IBM Plex Sans', sans-serif; font-size: 18px; color: #ffffff; font-weight: 400; margin: 0 0 6px 0;">Most businesses save <strong style="color: #00e676;">20+ hours per week</strong></p>
      <p style="font-family: 'IBM Plex Sans', sans-serif; font-size: 14px; color: #888888; margin: 0;">with the right automation strategy</p>
    </div>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding: 8px 0 24px;">
          <a href="https://automationbymeir.web.app/#contact" style="display: inline-block; padding: 14px 36px; background-color: #ffffff; color: #000000; font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; font-weight: 500; text-decoration: none; border-radius: 8px;">
            Book a Free Consultation &#8594;
          </a>
        </td>
      </tr>
    </table>
    <div style="text-align: center; padding-top: 20px; border-top: 1px solid #333333;">
      <p style="font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; color: #C4C4C4; margin: 0;">Ready to automate? Let's talk.</p>
      <p style="font-family: 'IBM Plex Sans', sans-serif; font-size: 18px; color: #ffffff; margin: 10px 0 0 0; font-weight: 600;">Meir Horwitz</p>
      <p style="font-family: 'IBM Plex Sans', sans-serif; font-size: 14px; color: #888888; margin: 5px 0 0 0;">Automation by Meir</p>
    </div>`;
};

export {
  getEmailTemplate,
  createNotificationEmailContent,
  createEnglishEmailContent,
  createHebrewEmailContent,
  createBriefConfirmationEmailContent,
  createBriefNotificationEmailContent,
  createChecklistEmailContent
};
