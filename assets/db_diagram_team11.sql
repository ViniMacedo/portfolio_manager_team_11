CREATE TABLE `portfolios` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int,
  `name` varchar(255),
  `created_at` timestamp
);

CREATE TABLE `transactions` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `portfolio_id` int,
  `product_symbol` varchar(255),
  `qty` decimal,
  `price` decimal,
  `product_type` enum(STOCK,BOND,CASH),
  `type` enum(BUY,SELL),
  `transaction_date` date,
  `fee` decimal
);

CREATE TABLE `holdings` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `portfolio_id` int,
  `product_symbol` varchar(255),
  `qty` decimal,
  `avg_price` decimal,
  `current_price` decimal,
  `last_updated` timestamp,
  `product_type` enum(STOCK,BOND,CASH)
);

CREATE TABLE `users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255)
);

ALTER TABLE `portfolios` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `transactions` ADD FOREIGN KEY (`portfolio_id`) REFERENCES `portfolios` (`id`);

ALTER TABLE `holdings` ADD FOREIGN KEY (`portfolio_id`) REFERENCES `portfolios` (`id`);
