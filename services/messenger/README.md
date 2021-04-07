# WhatsApp Messenger

User Sign In with Auth0.

On Sign In, 
 - if no local User = Create New User.

On Create New User, 
  - create Cloud Run messenger service and endpoint for User, max concurrency = 1.
  - create private storage bucket for User's chrome profile (zip and encrypt with key from Auth0).
  - create schedule for User to trigger sending messages.

On Delete Account,
  - delete Cloud Run messenger service and endpoint
  - delete storage bucket for User's chrome profile.
  - delete schedule for User's message triggers.

NodeJS server...

On Online & WebSocket connection established,
  - if QR code, send awaiting_auth msg /w QR code image.
  - if sidebar, send progress msg.



# Option 1: Deploy to Cloud Run and use Pusher to maintain sessions.

Auth0 -> Client, Server, Messenger, encrypt/decrypt storage

Client <-> Server : Pusher

Server -> Scheduler

Scheduler -> Pub/Sub : Handles retries, Throttle requests to Messenger to max 1 at a time.
  - Need to use Push messages, and find a way to throttle them because only one Tab is allowed at a time in WhatsApp

Pub/Sub -> Messenger : Cloud Run (max instances 1) responds 200 or 400 (pub/sub retries)

Messenger -> Client : Messenger Status, (Active) Request Status / Progress, Auth Status

Chrome profile from Cloud Storage, unzip, decrypt.

Puppeteer at node server start, pre-load whatsapp.

App service authenticates, warms up User's service (starts )