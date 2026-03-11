create table books (  
    id serial primary key,
    author varchar(255) not null,
    title varchar(255) not null,
    isbn varchar(255) not null,
    image varchar(255) not null,
    description text not null,
    category varchar(255) not null
);

INSERT INTO books (author, title, isbn, image, description, category) 
VALUES (
  'Markus Zusak', 
  'The Book Thief', 
  'PSU:000061286726', 
  'https://books.google.com/books/content?id=_MnZAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api', 
  'Trying to make sense of the horrors of World War II, Death is fascinated by one young girl, Liesel, whose book-stealing and story-telling talents help sustain her community, especially her family and the Jewish man they are hiding.', 
  'Juvenile Fiction'
);

/*
CREATE TABLE bookshelves (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255)
);

INSERT INTO bookshelves(name)
SELECT DISTINCT category FROM books;

ALTER TABLE books
ADD COLUMN bookshelf_id INT;

UPDATE books
SET bookshelf_id = shelf.id
FROM bookshelves AS shelf
WHERE books.category = shelf.name;

ALTER TABLE books
DROP COLUMN category;

ALTER TABLE books
ADD CONSTRAINT fk_bookshelves
FOREIGN KEY (bookshelf_id)
REFERENCES bookshelves(id); 
*/