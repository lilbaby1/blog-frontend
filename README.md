# blog-frontend
<h3>Front end blog application built with React that connects to the REST API blog-backend.</h3>

In order for the application to load posts it needs to be connected to the <a href="https://github.com/lilbaby1/blog-backend">blog-backend</a> application.

<h3>Functionality</h3>
Users can register or log in via forms that allow persistant log in. <br />
Authentication of users and their roles happens via JWT sent by axios in http cookie. <br />
On the home page, the post list can be set to start with either the newest or the oldest posts. <br />
Each post can be viewed individually. If the user is logged in, he/she can delete or edit their posts. <br />
Only admins can delete posts that are not theirs. Posts can only be editted by their author. <br />

<h4>To start the application make sure you have npm installed. Use <i>npm start</i> to start the application.</h4>

<h4>Admin - walt1 <br />
Password - walt1</h4>
User - walt2 <br />
Password - walt2
