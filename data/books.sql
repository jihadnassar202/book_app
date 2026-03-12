create table books (  
    id serial primary key,
    author varchar(255) not null,
    title varchar(255) not null,
    isbn varchar(255) not null,
    image varchar(255) not null,
    description text not null,
    category_id int,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

create table categories (
    id serial primary key,
    name varchar(255) unique not null
);
insert into categories (name) SELECT DISTINCT category FROM books;

ALTER TABLE books ADD column category_id int;

UPDATE books SET category_id = categories.id FROM categories WHERE books.category = categories.name;

ALTER TABLE books DROP COLUMN category;

ALTER TABLE books ADD CONSTRAINT fk_categories FOREIGN KEY (category_id) REFERENCES categories(id);


INSERT INTO categories (name) VALUES ('Juvenile Fiction');



INSERT INTO books (author, title, isbn, image, description, category_id) 
VALUES (
  'Markus Zusak', 
  'The Book Thief', 
  'PSU:000061286726', 
  'https://books.google.com/books/content?id=_MnZAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api', 
  'Trying to make sense of the horrors of World War II, Death is fascinated by one young girl, Liesel, whose book-stealing and story-telling talents help sustain her community, especially her family and the Jewish man they are hiding.', 
  null
  );


