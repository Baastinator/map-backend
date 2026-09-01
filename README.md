# Map Backend

## Install Guide

To install, clone the repository, run 'npm i' in the console, create a "
password.txt.ts" in /src containing the exported constant "password" with the
SQL database password, and create a .env containing the following entries:

- backendURL - URL for the backend, used for setting ImageURL in the Map Table
  rows
- databaseURI - URL for the MySQL database connection
