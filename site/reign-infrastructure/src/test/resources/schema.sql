-- Reflet du schéma réel de la table `login` de rAthena (server/sql-files/main.sql),
-- pour valider account.orm.xml contre une structure fidèle plutôt qu'un schéma généré par Hibernate.
DROP TABLE IF EXISTS login;

CREATE TABLE login (
  account_id int unsigned NOT NULL AUTO_INCREMENT,
  userid varchar(23) NOT NULL DEFAULT '',
  user_pass varchar(32) NOT NULL DEFAULT '',
  sex enum('M','F','S') NOT NULL DEFAULT 'M',
  email varchar(39) NOT NULL DEFAULT '',
  group_id tinyint NOT NULL DEFAULT 0,
  state int unsigned NOT NULL DEFAULT 0,
  unban_time int unsigned NOT NULL DEFAULT 0,
  expiration_time int unsigned NOT NULL DEFAULT 0,
  logincount mediumint unsigned NOT NULL DEFAULT 0,
  lastlogin datetime,
  last_ip varchar(100) NOT NULL DEFAULT '',
  birthdate date,
  character_slots tinyint unsigned NOT NULL DEFAULT 0,
  pincode varchar(4) NOT NULL DEFAULT '',
  pincode_change int unsigned NOT NULL DEFAULT 0,
  vip_time int unsigned NOT NULL DEFAULT 0,
  old_group tinyint NOT NULL DEFAULT 0,
  web_auth_token varchar(17),
  web_auth_token_enabled tinyint NOT NULL DEFAULT 0,
  PRIMARY KEY (account_id)
);

-- Reflet du schéma réel de la table `char` de rAthena (server/sql-files/main.sql). Table quotée
-- car `char` est un mot réservé SQL.
DROP TABLE IF EXISTS `char`;

CREATE TABLE `char` (
  char_id int unsigned NOT NULL AUTO_INCREMENT,
  account_id int unsigned NOT NULL DEFAULT 0,
  char_num tinyint NOT NULL DEFAULT 0,
  name varchar(30) NOT NULL DEFAULT '',
  class smallint unsigned NOT NULL DEFAULT 0,
  base_level smallint unsigned NOT NULL DEFAULT 1,
  job_level smallint unsigned NOT NULL DEFAULT 1,
  online tinyint NOT NULL DEFAULT 0,
  delete_date int unsigned NOT NULL DEFAULT 0,
  sex enum('M','F') NOT NULL,
  last_map varchar(11) NOT NULL DEFAULT '',
  save_map varchar(11) NOT NULL DEFAULT '',
  PRIMARY KEY (char_id),
  UNIQUE KEY name_key (name),
  KEY account_id_key (account_id)
);
