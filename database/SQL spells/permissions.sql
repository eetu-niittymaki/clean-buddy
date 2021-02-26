CREATE USER IF NOT EXISTS supplier@localhost IDENTIFIED BY suppliers.password;

GRANT SELECT, INSERT, UPDATE, DELETE ON products to supplier@localhost;

CREATE USER IF NOT EXISTS customer@localhost IDENTIFIED BY customers.password;

GRANT SELECT ON products to customer@localhost;