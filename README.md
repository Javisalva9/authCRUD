# authCrud
Example project with a CRUD and auth permissions

Requisites
Node and Mongo installed and running on your computer

How to:
npm i 
npm run start

On login register routes you will recieve a token that you will need to do different operations on the products routes.

Users can have different roles: admin or user. By default everyone is user, at the moment you can register admin users, on production you should only allow other admins create admins.

Admins can delete other users and do operation on products where they're not the owner.

How search works on /products endpoint. Depending on the query param you add to the request:
// name/description regex
// price lower than
// category exact match
// createdBy regex by name of creator
