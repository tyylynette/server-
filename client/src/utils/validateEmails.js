//function to validate email format
const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default emails => {
  //split emails by comma, then for each email trim off all the spaces
  const invalidEmails = emails
    .split(',')
    .map(email => email.trim()) //trim off all the empty spaces
    .filter(email => email) //remove all the empty strings
    .filter(email => re.test(email) === false); //validate email againt regex, filter and return the invalid emails

  if (invalidEmails.length) {
    return `These emails are invalid: ${invalidEmails}`;
  }
  return;
};
