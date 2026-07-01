/**
 * Young Fresh Coconut — contact form handler.
 *
 * What it does: receives a POST from the website contact form, appends a row
 * to a Google Sheet, and emails you a notification. No server required.
 *
 * ── SETUP ──────────────────────────────────────────────────────────────────
 * 1. Create a Google Sheet. Copy its ID from the URL
 *    (https://docs.google.com/spreadsheets/d/THIS_PART/edit) into SHEET_ID.
 * 2. Put the address that should receive leads into NOTIFY_EMAIL.
 * 3. Go to script.google.com → New project → paste this file.
 * 4. Deploy ▸ New deployment ▸ type "Web app".
 *      - Execute as:        Me
 *      - Who has access:    Anyone
 *    Copy the /exec URL it gives you.
 * 5. Paste that URL into FORM_ENDPOINT in index.html (submitForm).
 * 6. Test the form on the site; check the Sheet + your inbox.
 * ────────────────────────────────────────────────────────────────────────────
 */

var SHEET_ID     = 'REPLACE_WITH_YOUR_SHEET_ID';
var NOTIFY_EMAIL = 'meetsenjaliya@hphtcolordiamond.com';
var SHEET_NAME   = 'Leads';

function doPost(e) {
  try {
    var p = (e && e.parameter) || {};
    var name    = String(p.name    || '').slice(0, 200);
    var email   = String(p.email   || '').slice(0, 200);
    var subject = String(p.subject || '').slice(0, 300);
    var message = String(p.message || '').slice(0, 5000);
    var source  = String(p.source  || '').slice(0, 200);

    if (!name || !email || !message) {
      return json_({ ok: false, error: 'missing required fields' });
    }

    // 1) Append to the Sheet
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Subject', 'Message', 'Source']);
    }
    sheet.appendRow([new Date(), name, email, subject, message, source]);

    // 2) Email notification
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: 'New website enquiry: ' + (subject || '(no subject)'),
      replyTo: email,
      body:
        'Name:    ' + name + '\n' +
        'Email:   ' + email + '\n' +
        'Subject: ' + subject + '\n\n' +
        message + '\n\n' +
        '— sent from ' + source,
    });

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json_({ ok: true, service: 'young-fresh-coconut form handler' });
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
