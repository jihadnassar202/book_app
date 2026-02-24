'use strict';
const superagent = require('superagent');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('node:path');
const app = express();
const port = process.env.PORT || 3000;
const books_api_key = process.env.GOOGLE_BOOKS_API_KEY;
//cors is a middleware that allows the server to accept requests from different origins
function secureHttpUrl(url){
    if(!url){
        return url;
    }
     if(url.startsWith('http://')){
        return url.replace('http://', 'https://');
     }
     return url;
    
    }
 
class Book {
    constructor(title, author, image, description){
        this.title = title;
        this.author = author;
        this.image =secureHttpUrl(image);
        this.description = description;
    }
} 

app.use(cors());
app.set('views' ,path.join(__dirname ,'views'));      

app.set('view engine' ,'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));//to serve static files like css,js,images
app.get('/',function(req ,res){
        res.render('pages/searches/show');
    });
   
app.post('/searches',async function(req ,res){
    const {name , type}= req.body;
    if(!name){
        return res.status(400).json({error: 'Name is required'});}
    const url =await superagent.get(`https://www.googleapis.com/books/v1/volumes?q=${type === 'Author' ? `inauthor:${name}` : name}&key=${books_api_key}&maxResults=10`);
    if(url.status !== 200){
        return res.status(404).json({error: 'Book not found'});
    }
    const data = await url.body;
    const items = data.items || [];
    const books = items.slice(0,10).map(item => new Book(
         item.volumeInfo.title,
         item.volumeInfo?.authors?.[0]??null, 
         item.volumeInfo.imageLinks?.thumbnail,  
         item.volumeInfo.description)); 
    res.render('pages/index', { books:books}); 
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

