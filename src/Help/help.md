# Using Cháo
## Groups
Groups are a list of contacts. Head to [/groups](/groups) to see all of your groups.
You can edit the name of your group, or the visual color of your group.

## Contacts
Each contact is unique to a group and contains a name and email.

### Name
A name is any string to represent the name of your contact.

### Email
An email is a string of comma seperated email addresses foreach contact.

## Sending Emails
Head to [/compose](/compose) to send an email.

### To Whom
Choose who will recieve the email by adding one or more of your groups. 
You can also put email addresses into this field.

### Subject
The email's subject.

### From Whom
Choose the sender of the email. This can be the Cháo email address, or one of your set up accounts.

### Body
The email's body is written in markdown. Markdown is a great syntax for rapidly prototyping your email. You 
can also pass in HTML to your markdown, so you can get a creative as you'd like. This allows for really quick 
creating of emails without complicated templates and predefined issues.

**You can save your emails as drafts, and emails are automatically saved as you edit.**

### Advanced Settings
You can control several advanced settings when sending emails:
* Add unsubscribe link: _Set true by default_
* Reply to address: _Sender by default, this is where emails will reply to_

## Emails
Head to [/emails](/emails) to see your emails. This is a list of emails that you have sent, attempted to send, or 
drafts that have been saved.

After you send an email you'll see the email's status:
* Queueing email. _This email is being queued for processing_
* Gathering email addresses. _This email is gathering all of the email addresses associated with your groups and email addresses_
* Preparing email to be sent. _This email is being sent through the specified STMP_
* Email sent! _This email was sent! <3_

Once you have attempted to send an email you can no longer edit or delete it. If there was an error in sending 
an email you can try resending it.
