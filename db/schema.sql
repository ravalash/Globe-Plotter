CREATE DATABASE zpdkmn5jiayztj9b;
USE zpdkmn5jiayztj9b;

-- Initial table creation with columns for burger names and boolean devoured status. ID set automatically.
CREATE TABLE users ( 
    id int NOT NULL AUTO_INCREMENT,
	user_name varchar(255) NOT NULL,
	password varchar(255), NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE trips (
    

);
