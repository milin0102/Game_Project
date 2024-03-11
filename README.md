# Games Backend  project

A project where user can play games , save score , check total score and ranking among other players , even user can check weekly scores and rank

---
## Requirements

For development, you will only need Node.js

## Install

    $ git clone https://github.com/milin0102/Game_Project.git
    $ cd backend
    $ npm install express mongoose cors express figlet mongodb nodemon joi bcrypt crypto dotenv moment
## Scripts and Setup

    $ Add  "start": "nodemon index.js" in package.json file under scripts key , if not added
    $ create .env file similar to sample-env-file.txt
    $ Add mongodb username ,password and crypto secret key in .env file , shared over the email along with curls file.

## Running the project

    $ npm run start -- initialize nodemon for further live reloading

## Simple build for production

    $ npm build

## 
