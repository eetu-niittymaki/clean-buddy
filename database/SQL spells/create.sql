CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT,
    first_name VARCHAR(45) NOT NULL,
    last_name VARCHAR(45) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(45) NOT NULL,
    email VARCHAR(45) NOT NULL,
    password VARCHAR(45),
    PRIMARY KEY(customer_id),
    CONSTRAINT uc_address_phone_email_password UNIQUE(address, phone, email, password)
);

CREATE TABLE suppliers(
    supplier_id INT AUTO_INCREMENT,
    name VARCHAR(45) NOT NULL,
    phone VARCHAR(45) NOT NULL,
    email VARCHAR(45) NOT NULL,
    password VARCHAR(45) NOT NULL,
    PRIMARY KEY(supplier_id),
    CONSTRAINT uc_name_phone_email_password UNIQUE (name, phone, email, password)
);

CREATE TABLE products(
    product_id INT AUTO_INCREMENT,
    supplier_id INT,
    product_name VARCHAR(45) UNIQUE,
    product_description VARCHAR(255),
    product_price DECIMAL(15, 2),
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
    total_price DECIMAL(15, 2),
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

--Get database table filesizes
SELECT table_schema AS "Database", SUM(data_length + index_length) / 1024 / 1024 AS "Size (MB)" FROM information_schema.TABLES GROUP BY table_schema