#!/bin/bash

#passed parameters
hostname=$1

#Standard Details for SSL certs
country=GB
state=Sunderland
locality=TyneAndWear
organization=tombola.com
organizationalunit=IT
email=keithbarrow@tombola.com

#Other Default
keyDir=/keys
echo $taApiSslPassPhrase

#Set default hostname if not supplied
if [ -z "$hostname" ]; then
    hostname='eutaveg-01.tombola.emea'
    echo -e 'no key specified defaulting to ' $hostname
fi;

openssl genrsa -des3 -passout pass:$taApiSslPassPhrase -out $keyDir/tombolaApi.key 2048
openssl req -new -key $keyDir/tombolaApi.key -out $keyDir/tombolaApi.csr -passin pass:$taApiSslPassPhrase -subj "/C=$country/ST=$state/L=$locality/O=$organization/OU=$organizationalunit/CN=$hostname/emailAddress=$email"
openssl x509 -req -days 3650 -in $keyDir/tombolaApi.csr -passin pass:$taApiSslPassPhrase -signkey $keyDir/tombolaApi.key -out $keyDir/tombolaApi.crt