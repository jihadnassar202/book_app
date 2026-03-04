'use strict';
const superagent = require('superagent');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('node:path');
const app = express();
const port = process.env.PORT || 3000;
const books_api_key = process.env.GOOGLE_BOOKS_API_KEY;
 const{Pool} = require('pg');
 const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
 });
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
    constructor(title, author, image, description, isbn, category){
        this.title = title;
        this.author = author;
        this.image =secureHttpUrl(image);
        this.description = description ?? 'No description available';
        this.isbn = isbn;
        this.category = category;
    }
} 
//cors is a middleware that allows the server to accept requests from different origins
app.use(cors());
app.set('views' ,path.join(__dirname ,'views'));      
app.set('view engine' ,'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));//to serve static files like css,js,images
app.use(express.static(path.join(__dirname, 'views/layouts')));

app.get('/',async function(req ,res){
try{
const {rows} = await pool.query('SELECT * FROM books order by id desc');
const totalBooks = rows.length;
res.render('pages/index', {books: rows, totalBooks: totalBooks});
}
catch(error){
    console.error('Error fetching books:', error);
    res.status(500).json({error: 'Internal server error'});
}
});

app.post('/books',async function(req ,res){
    const {title, author, image, description, isbn, category} = req.body;
    const safeAuthor = author || 'Unknown Author';
    const safeTitle = title || 'Unknown Title';
    const safeDescription = description || 'No description available';
    const safeImage = image || '';
    const safeIsbn = isbn || '';
    const safeCategory = category || '';
    try{
        const {rows} = await pool.query('INSERT INTO books (title, author, image, description, isbn, category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            [safeTitle, safeAuthor, secureHttpUrl(safeImage), safeDescription, safeIsbn, safeCategory]
        );
        const newBook = rows[0];
        res.redirect(`/books/${newBook.id}`);
    }
    catch(error){
        console.error('Error adding book:', error);
        res.status(500).json({error: 'Internal server error'});

    }
});

app.get('/books/:id',async function(req ,res){
    const {id} = req.params;
    try{
        const {rows} = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
        res.render('pages/books/show', {book: rows[0]});
        if(rows.length === 0){
            return res.status(404).json({error: 'Book not found'});
        }
    }
    catch(error){
        console.error('Error fetching book:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});
app.get('/searches/new',function(req ,res){
        res.render('pages/searches/new');  
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
         item.volumeInfo.description,
         item.volumeInfo.industryIdentifiers?.[0]?.identifier ?? null,
         item.volumeInfo.categories?.[0] ?? null
        )); 
        
    res.render('pages/searches/show', { books:books}); 
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

