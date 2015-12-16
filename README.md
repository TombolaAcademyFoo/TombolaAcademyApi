# TombolaAcademyApi
##Running locally
See the notes about Deploying to Live below? Do those, but specifiy the hostname (try *`localhost`*). Then run `gulp`, not the `nohup` command

##Deploying to Live
###Pre-Requisites
* Node and Npm
* Git
These should alread be set up on the current machine, but will need to be set up if you have a new box.
###Setting up the Environment
Add the environment variables, open the file:
````bash
sudo nano /etc/profile
````
Add the following somewhere to the file in nano:
````bash
export taApiPort=3000
export taApiAuthExpiry=1440
export taApiDBHost=eutaveg-01.tombola.emea
export taApiDBName=tombola-academy
export taApiDBUser=XXXXXXX
export taApiDBPassword=XXXXXXXX
export taApiTokenSecret=XXXXXXXX
export taApiSslPassPhrase=XXXXXXXXXX
`````
 Where *`taApiDBUser`* and *`taApiDBPassword`* are the credentials used to log into the DB. 
*`taApiTokenSecret`* is the secret used generate the user tokens
*`taApiSslPassPhrase`* is the phrase used to generate the SSL certs
Save when done.
*Now RESTART your terminal* , or you could source the /etc/profile file (haven't tested the latter). Confirm everything is working by running *export* in a bash terminal to display the env variables- the values should appear.

In root of the project is a bash script setup.sh to execute:
````bash
sudo mkdir /keys
sudo chmod a+w /keys

chmod +x setupkeys.sh
./setupkeys.sh [hostname]
````
`[hostname]` is optional - you shouldn't need to supply it on live, as it defaults to `eutaveg-01.tombola.emea`. Use `localhost` for local files.

###Setting up the app
1. If the npm package is not installed run `npm install git://github.com/TombolaAcademyFoo/TombolaAcademyApi`
2. Easiest thing to do is to run gulp  and ctrl-c out when done. This creates the build directory. 
2. *`cd`* into the *`.build`* directory 
3. Execute *`nohup node api-app.js &`*



###Logs
There are two logs - the nohup.out log in the .
The log can be followed by using the tail command on the nohup.out file. This nohup file is auto-trunctated monthly, the script on the server is in */etc/cron.monthly* called: *tombola-academy-api.sh*
````bash
truncate /home/keith.barrow/node_modules/tombola-academy-api/.build/nohup.out --size 1000000
truncate /home/keith.barrow/node_modules/tombola-academy-api/.build/logs/all-logs.log --size 1000000
````
