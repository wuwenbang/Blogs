```bash
# 创建容器
docker run -itd --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql
# 进入容器
docker exec -it mysql bash
# 运行 mysql
mysql -u root -p 123456
# 查看数据库
show databases;
# 选择数据库
use xxx;
# 查看表
show tables;
# 查看表内容
select * from xxx;
```
