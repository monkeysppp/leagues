# SSL certificates

This folder must contain a private key called `key.pem` and a public key called `cert.pem`.  You may want to lock the permissions of the `key.pem` file so it cannot be read by another user on your machine.

You can either use real certificates (maybe generated from LetsEncrypt), or self-signed certificates (manually created or acquired from somewhere like https://www.selfsignedcertificate.com/).
