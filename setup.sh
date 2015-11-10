#!/bin/bash

#passed parameters
username=$1
password=$2
tokenSecret=$3
sslPassphrase=$4
hostname=$5

#Standard Details for SSL certs
country=GB
state=Sunderland
locality=TyneAndWear
organization=tombola.com
organizationalunit=IT
email=keithbarrow@tombola.com

#Other Defaultsls 0la
keyDir=/keys

#Validate the inputs
if [ -z "$username" ] || [ -z "$password" ] || [ -z "$tokenSecret" ] || [ -z "$sslPassphrase" ]; then
    echo
    echo -e 'usage ./setup.sh username password certSecret passphrase [hostname]'
    echo -e 'where'
    echo -e '\tusername = the name of db user to log into MySql with'
    echo -e '\tpassword = the password of db user to log into MySql with'
    echo -e '\ttokenSecret = the auth secret used in issuing tokens'
    echo -e '\tpassphrase = the passphrase used to set up the SSL certs'
    echo -e '\[hostname] = the name of the hosts to generate keys for - defaults to '
    echo
    exit -1
fi;

#Set default hostname if not supplied
if [ -z "$hostname" ]; then
    hostname='eutaveg-01.tombola.emea'
    echo -e 'no key specified defaulting to ' $hostname
fi;

openssl genrsa -des3 -passout pass:$sslPassphrase -out $keyDir/tombolaApi.key 2048
openssl req -new -key $keyDir/tombolaApi.key -out $keyDir/tombolaApi.csr -passin pass:$sslPassphrase -subj "/C=$country/ST=$state/L=$locality/O=$organization/OU=$organizationalunit/CN=$hostname/emailAddress=$email"
openssl x509 -req -days 3650 -in $keyDir/tombolaApi.csr -passin pass:$sslPassphrase -signkey $keyDir/tombolaApi.key -out $keyDir/tombolaApi.crt

#Remove existing
unset taApiPort
unset taApiAuthExpiry
unset taApiDBHost
unset taApiDBName
unset taApiDBUser
unset taApiDBPassword
unset taApiTokenSecret
unset taApiSslPassPhrase

#Add the default stuff
echo 'Adding Standard env variables'
export taApiPort=3000
export taApiAuthExpiry=1440
export taApiDBHost=eutaveg-01.tombola.emea
export taApiDBName=tombola-academy

#Add the secret stuff
echo 'Adding Supplied env variables'
export taApiDBUser=$username
export taApiDBPassword=$password
export taApiTokenSecret=$tokenSecret
export taApiSslPassPhrase=$sslPassphrase