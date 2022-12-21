const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const ejs = require('ejs');

const app = express();
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

mongoose.connect('mongodb://localhost:27017/wikiDB');

const articleSchema = ({
    title: String,
    content: String
})

const article = mongoose.model('article', articleSchema);

app.route('/articles')
    .get((req, res) => {
        article.find({}, (err, articles) => {
            if (!err) {
                res.send(articles);
            } else {
                res.send(err);
            }
        })
    })
    .post((req, res) => {
        const newArticle = new article({
            title: req.body.title,
            content: req.body.content
        })
        newArticle.save((err) => {
            if (!err) {
                res.send('POST was succesfull');
            }
        })
    })
    .delete((req, res) => {
        article.deleteMany({}, (err) => {
            if (!err) {
                res.send('DELETE was succesfull');
            }
        })
    })

app.route('/articles/:articleTitle')
    .get((req, res) => {
        article.findOne({ title: req.params.articleTitle }, (err, article) => {
            if (!err) {
                if (article) {
                    res.send(article);
                } else {
                    res.send('No article found')
                }
            } else {
                res.send(err);
            }
        })
    })
    .put(function (req, res) {
        article.updateOne(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            (err) => {
                if (!err) {
                    res.send("Successfully updated Article!")
                } else {
                    res.send(err);
                }
            }
        )
    })
    .delete((req, res) => {
        article.deleteOne({ title: req.params.articleTitle }, (err) => {
            if (!err) {
                res.send("Successfully deleted")
            } else {
                res.send(err);
            }
        })
    })

app.listen('3000', () => {
    console.log('app running on port 3000')
})
