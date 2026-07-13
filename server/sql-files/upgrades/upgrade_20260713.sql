ALTER TABLE `char`
	ADD COLUMN `faction` tinyint(3) unsigned NOT NULL default '0' AFTER `disable_showcostumes`
;
