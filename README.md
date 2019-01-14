# Node Mock Server
Mock Server Implementation in Node.

#### Steps
    $ git clone https://github.com/kshateesh/node-mock-serever.git
    $ cd node-mock-server
    $ npm install
    $ export NODE_ENV=production
    $ export SECRET=secretkey
    $ npm start

    Access at http://localhost:3000


#### Working
User can create projects and add mock APIs to the projects. By default, user is granted full access to the project created by user. Admins can assign/re-assign projects to different users.
Mock APIs are throttled to 20 requests per hour.


#### Models
- User - For Storing User data
- ACL - Access Control for Users
- Project - Project Model
- API - Collection of Mock APIs created by user





 