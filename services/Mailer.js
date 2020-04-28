const sendgrid = require('sendgrid');
const helper = sendgrid.mail; //helper to create mailer
const keys = require('../config/keys');

class Mailer extends helper.Mail {
  constructor({ subject, recipients }, content) {
    //setup, pass subj, recipient obj and  content = html template
    super();

    this.sgApi = sendgrid(keys.sendGridKey); //signature containing API key
    this.from_email = new helper.Email('tan.yingyu.lynette@dhs.sg'); //who email is sent from
    this.subject = subject;
    this.body = new helper.Content('text/html', content); //pass emailtemplate html to body
    this.recipients = this.formatAddresses(recipients);

    this.addContent(this.body); //inbuilt function in mailer we need to call this.body
    this.addClickTracking(); //inbuilt functon
    this.addRecipients();
  }

  formatAddresses(recipients) {
    return recipients.map(({ email }) => {
      //recipients.email , extract only email
      return new helper.Email(email);
    });
  }

  addClickTracking() {
    const trackingSettings = new helper.TrackingSettings();
    const clickTracking = new helper.ClickTracking(true, true);

    trackingSettings.setClickTracking(clickTracking);
    this.addTrackingSettings(trackingSettings);
  }

  addRecipients() {
    const personalize = new helper.Personalization(); //new personalize object

    this.recipients.forEach(recipient => {
      personalize.addTo(recipient); //add recipient to personalize object
    });
    this.addPersonalization(personalize); //send personalize obj to sendgrid func
  }

  async send() {
    const request = this.sgApi.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: this.toJSON()
    });
    const response = await this.sgApi.API(request); //send it off to sendgrid
    return response;
  }
}

module.exports = Mailer;
