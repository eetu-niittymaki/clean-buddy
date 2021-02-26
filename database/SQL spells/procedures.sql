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
