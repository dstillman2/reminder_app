import sendgrid from 'sendgrid';

/**
 * create email send grid
 * @param {String} emailAddress email address
 * @param {String} uniqueId unique id
 * @param {String} msgSubject title of email
 * @param {String} message body of email
 * @returns {Object} mail object
 */
function createEmail(emailAddress, uniqueId, msgSubject, message) {
  const helper = sendgrid.mail;
  const fromEmail = new helper.Email('no-reply@localhost');
  const toEmail = new helper.Email(emailAddress);
  const subject = msgSubject || 'Forgot Password';
  const msg = message || `Please click the following link to reset your password: forgot_password/reset?token=${uniqueId}`;
  const content = new helper.Content('text/plain', msg);

  const mail = new helper.Mail(fromEmail, subject, toEmail, content);

  return mail;
}

export default createEmail;
