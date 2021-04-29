CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT,
    first_name VARCHAR(45) NOT NULL,
    last_name VARCHAR(45) NOT NULL,
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    postcode VARCHAR(255) NOT NULL,
    phone VARCHAR(45) NOT NULL,
    email VARCHAR(45) NOT NULL,
    password VARCHAR(45),
    PRIMARY KEY(customer_id),
    CONSTRAINT uc_address_phone_email_password UNIQUE(phone, email, password)
);

CREATE TABLE suppliers(
    supplier_id INT AUTO_INCREMENT,
    name VARCHAR(45) NOT NULL,
    supplier_description VARCHAR(255) NOT NULL,
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    postcode VARCHAR(255) NOT NULL,
    phone VARCHAR(45) NOT NULL,
    email VARCHAR(45) NOT NULL,
    password VARCHAR(45) NOT NULL,
    PRIMARY KEY(supplier_id),
    CONSTRAINT uc_name_phone_email_password UNIQUE (name, phone, email, password)
);

CREATE TABLE products(
    product_id INT AUTO_INCREMENT,
    supplier_id INT,
    product_name VARCHAR(45),
    product_description VARCHAR(255),
    product_price DECIMAL(15,3),
    created_at TIMESTAMP NOT NULL,
    ends_at DATE NOT NULL,
    work_hours DECIMAL(15,3) NOT NULL,
    product_is_available BOOLEAN NOT NULL,
    PRIMARY KEY (product_id),
    FOREIGN KEY (supplier_id)
        REFERENCES suppliers (supplier_id)
        ON UPDATE RESTRICT ON DELETE CASCADE
);

CREATE TABLE orders(
    order_id INT AUTO_INCREMENT,
    customer_id INT,
    order_date TIMESTAMP,
    PRIMARY KEY (order_id),
    FOREIGN KEY (customer_id)
        REFERENCES customers (customer_id)
        ON UPDATE RESTRICT ON DELETE CASCADE
);

CREATE TABLE order_items(
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    total_price DECIMAL(15, 3),
    PRIMARY KEY(order_id, product_id),
    FOREIGN KEY (order_id)
        REFERENCES orders (order_id)
        ON UPDATE RESTRICT ON DELETE CASCADE,
    FOREIGN KEY (product_id)
        REFERENCES products (product_id)
        ON UPDATE RESTRICT ON DELETE CASCADE
);

CREATE TABLE supplier_reviews(
    review_id INT AUTO_INCREMENT,
    supplier_id INT,
    order_id INT,
    description VARCHAR(255) NOT NULL,
    score DECIMAL(1,1) NOT NULL,
    order_exists BOOLEAN,
    PRIMARY KEY(review_id),
    FOREIGN KEY (supplier_id)
        REFERENCES suppliers (supplier_id)
        ON UPDATE RESTRICT ON DELETE CASCADE,
    FOREIGN KEY (order_id)
        REFERENCES orders (order_id)
        ON UPDATE RESTRICT ON DELETE CASCADE
);

/*
CREATE TABLE timed_offers(
    offer_id INT,
    product_id INT,
    quantity INT NOT NULL,
    price DECIMAL(15, 3),
    PRIMARY KEY(offer_id, product_id),
    FOREIGN KEY (product_id)
        REFERENCES products (product_id)
        ON UPDATE RESTRICT ON DELETE CASCADE
);
*/

CREATE TABLE offer_requests(
    request_id INT AUTO_INCREMENT,
    apartment_type VARCHAR(255) NOT NULL,
    apartment_area DECIMAL(15,2) NOT NULL,
    cleaning_frequency VARCHAR(255) NOT NULL,
    request_suppliers VARCHAR(255) NOT NULL,
    optional_information VARCHAR(255),
    first_name VARCHAR(45) NOT NULL,
    last_name VARCHAR(45) NOT NULL,
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    postcode VARCHAR(255) NOT NULL,
    phone VARCHAR(45) NOT NULL,
    email VARCHAR(45) NOT NULL,
    PRIMARY KEY (request_id)
);

INSERT INTO customers (first_name, last_name, street_address, city, postcode, phone, email, password)
VALUES ("Pekka", "Hmmm", "Munkoti", "Lohja", "54321", "+42231231", "mä@hä.fi", "911WasAnInsideJob");

--Get database table filesizes
SELECT table_schema AS "Database", SUM(data_length + index_length) / 1024 / 1024 AS "Size (MB)" FROM information_schema.TABLES GROUP BY table_schema