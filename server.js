const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const path = require('path');

//start handle bars set up
//const exphbs = require('express-handlebars');
//const hbs = exphbs.create({});
//end handle bars

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))

//start handle bars set up
// app.engine('handlebars', hbs.engine);
// app.set('view engine', 'handlebars');
//end handle bars

// turn on routes
app.use(routes);

// turn on connection to db and server
//force true remakes table when changes are made
sequelize.sync({ force: true }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});


// [
//   {
//      "title": "CSS",
//      "post_url": "https://cssgradient.com",
//      "user_id": 3
//   }
//   ,
  // {
  //   "title": "Runbuddy reaches 1 million subscribers",
  //   "post_url": "https://runbuddy.com/press",
  //   "user_id": 1
  // }
//   ]


// USE 

// INSERT INTO post (title, post_url, user_id, created_at, updated_at)
// VALUES ("Taskmaster goes public!", "https://taskmaster/press", 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);