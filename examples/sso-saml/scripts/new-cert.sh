# Create RSA Private key
openssl genrsa 2048 > privatekey.pem

# Create Certificate Signing Request
openssl req -new -key privatekey.pem -out csr.pem

# Sign the certificate with the private key
openssl x509 -req -days 365 -in csr.pem -signkey privatekey.pem -out public.crt

