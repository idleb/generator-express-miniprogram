CREATE TABLE IF NOT EXISTS `user` (
  `openid` varchar(64) NOT NULL COMMENT '微信用户ID',
  `unionid` varchar(128) default NULL COMMENT '微信unionid',
  `session_key` varchar(128) default NULL,
  `nickName` varchar(128) default NULL COMMENT '用户名',
  `gender` int(11) NOT NULL default '0' COMMENT '性别',
  `country` varchar(64) default NULL COMMENT '国家',
  `province` varchar(64) default NULL COMMENT '省份',
  `city` varchar(64) default NULL COMMENT '城市',
  `avatarUrl` varchar(128) default NULL COMMENT '头像',
  `role` enum('user','admin') NOT NULL default 'user',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`openid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
