TheQuarantini.Club is A video chatting platform for your friends only where you can order virtual drinks in a club-like atmosphere and chat with friends while sipping on an Espresso Martini that your resident bartender just served you. These chatrooms have no time limit unlike Zoom and are private to your friends with a unique code. Host up to 8 friends in the room for a fun time socializing while keeping your distance!

# Set up

## Requirements:

- Node.js
- A Twilio account - sign up
- Strip Account - sign up

Twilio Account Settings:
- This project utilizes the Twilio Programmable Video SDK.

Config Value Description:
- Account Sid	Your primary Twilio account identifier - find this in the Console.
- Auth Token	Used to authenticate - just like the above, you'll find this here.
- Video API Key - found in the video sdk dashbaord
- Video API Secret - also found in the video sdk dashboard
- Stripe Public Key - found in the Strip account dashbaord
- Stripe Private Key - found in the Strip account dashbaord

After the above requirements have been met:

Clone this repository (Client) and cd into it

```
https://github.com/ClubQuarentini/ClubQuarantini-Frontend.git
```
Install dependencies

```
npm install
```
Inside the client repo, navgiate to the below path and replace the Stripe public key with your own

```
/src/components/Bar/Bar.js
```

Clone backend repository (Server) and cd into it on another termimal tab

```
https://github.com/ClubQuarentini/ClubQuarantini-Backend.git
```
Install dependencies

```
npm install
```
In the server repo, create a new ".env" from the ".env.sample"
- add the enviorment varibles from ".env.sample" to the new .env file and add the keys from the config value description

Still being in the server repo, run this command to start the server

```
npm start
```
Move to the client directory and run this command to start the client

```
npm start
```

Navigate to http://localhost:3000
That's it!
