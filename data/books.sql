create table books (  
    id serial primary key,
    author varchar(255) not null,
    title varchar(255) not null,
    isbn varchar(255) not null,
    image varchar(255) not null,
    description text not null,
    category varchar(255) not null
);

