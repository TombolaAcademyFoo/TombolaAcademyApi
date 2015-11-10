# TombolaAcademyApi
##Running locally
See the notes about running the setup script below? Do that, specifiy the hostname (try *localhost*). Then run gulp...

##Deploying to Live
###Setting up the Environment
In root of the project is a bash script setup.sh to execute:
````bash
chmod +x setup.sh
source setup.sh username password tokenSecret passPhrase [hostname]
````
Where *username* and *password* are the credentials used to log into the DB. 
*TokenSecret* is the secret used generate the user tokens
*passPhrase* is the phrase used to generate the SSL certs
*[hostname]* is optional - you shouldn't need to supply it on live, as it defaults to eutaveg-01.tombola.emea
Values can be ammended later by re-running the script, or re-exporting the value. The environment variable names can be found in the script or the config.js file if you need them.

###Setting up the app
1. Easiest thing to do is to run gulp  and ctrl-c out when done. This creates the build directory. 
2. cd into the build directory 
3. Execute nohup node api-app.js &

The log can be followed by using the tail command on the nohup.out file. This nohup file is auto-trunctated monthly, the script on the server is in /etc/cron.monthly


