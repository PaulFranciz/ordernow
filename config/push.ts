/* importScripts("https://js.pusher.com/beams/service-worker.js"); */

/*http://localhost:3000/service-worker.js*/


/* Step 1
Create a service worker
1
Create a file called service-worker.js:

service-worker.js
Download

Copy
importScripts("https://js.pusher.com/beams/service-worker.js");
2
Serve this file from the root of your website:

http://localhost:3000/service-worker.js
3
Open http://localhost:3000/service-worker.js in your browser to verify that it is being served. You should see the plaintext content of the file you just created. Load the SDK via a script tag in your website:


Copy
<script src="https://js.pusher.com/beams/1.0/push-notifications-cdn.js"></script>
Step 3
Register your first web device
1
Paste this snippet into your website to register your browser with our service and subscribe to the Device Interest hello:

Javascript

Copy
<script>
  const beamsClient = new PusherPushNotifications.Client({
    instanceId: '02c44728-c094-462f-acbe-9a80572853f1',
  });

  beamsClient.start()
    .then(() => beamsClient.addDeviceInterest('hello'))
    .then(() => console.log('Successfully registered and subscribed!'))
    .catch(console.error);
</script>
2
Open the page in your browser which now has the previous snippet.

3
Grant the notification permission when prompted.

If a permission prompt does not appear, you may have to enable the notification permission in the top left of your address bar and refresh.

4
Look in your browser console for:
Successfully registered and subscribed! Step 4
Publish a Beams push notification
After subscribing to the "hello" interest in the previous step, you can now try sending a message by copying the command below into your terminal.

Console

Copy
curl -H "Content-Type: application/json" \
     -H "Authorization: Bearer CB4B491C656FAB26AD8A3FBAFADCA7586480F42A3ADCB4E084B056DD7014E914" \
     -X POST "https://02c44728-c094-462f-acbe-9a80572853f1.pushnotifications.pusher.com/publish_api/v1/instances/02c44728-c094-462f-acbe-9a80572853f1/publishes" \
     -d '{"interests":["hello"],"web":{"notification":{"title":"Hello","body":"Hello, world!"}}}'
 */