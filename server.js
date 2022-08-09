// REQUIRES
const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const db = require('./config/connection');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
require('dotenv').config();
const { view_routes, auth_routes } = require('./controllers');

const app = express();
app.use(express.static(path.join('public')));
app.engine('hbs', engine({ extname: 'hbs' }));
const PORT = process.env.PORT || 3333;
app.set('view engine', 'hbs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    store: new SequelizeStore({ db }),
    saveUninitialized: false,
    resave: false,
    cookie: {
        httpOnly: true
    }
}));
app.use('/', view_routes)
app.use('/auth', auth_routes)

db.sync().then(() => {
    app.listen(PORT, () => console.log(`LISTENING ON PORT ${PORT}`)) 
})