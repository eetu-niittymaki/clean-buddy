DELIMITER $$

CREATE PROCEDURE test()
BEGIN 
    SELECT * FROM customers
    ORDER BY first_name ASC;
END $$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE insert_if_not_exists(
        IN first_name_in VARCHAR(45), 
        IN last_name_in VARCHAR(45), 
        IN address_in VARCHAR(255), 
        IN phone_in VARCHAR(45), 
        IN email_in VARCHAR(45), 
        IN password_in VARCHAR(45))
BEGIN 
    IF NOT EXISTS 
        INSERT INTO customers (first_name, last_name, address, phone, email, password)
        VALUES (first_name_in, last_name_in, address_in, phone_in, email_in, password_in);
    ELSE 
        SELECT * FROM customers 
        WHERE (phone = phone_in
        AND address = address_in);
    END IF;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE saveOrder(
                IN supplierIdIn INT, 
                IN customerIdIn INT, 
                IN productIdIn INT, 
                IN quantityIn INT)
BEGIN 
    INSERT INTO orders (supplier_id, customer_id)
    VALUES (supplierIdIn, customerIdIn);
    INSERT INTO order_items
    SET order_id = (SELECT MAX(order_id) FROM orders),
        product_id = productIdIn,
        quantity = quantityIn,
        total_price = (SELECT product_price FROM products 
                        WHERE product_id = productIdIn) * quantityIn;
END $$

DELIMITER ;
        
        
