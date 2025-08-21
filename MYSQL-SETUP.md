# 🗄️ MySQL Setup Guide for IIIT-Una Feed

## Quick MySQL Setup (Ubuntu/Debian)

### 1. Install MySQL
```bash
sudo apt update
sudo apt install mysql-server -y
```

### 2. Start MySQL Service
```bash
sudo systemctl start mysql
sudo systemctl enable mysql
```

### 3. Secure MySQL Installation
```bash
sudo mysql_secure_installation
```
- Set root password (or keep empty for socket authentication)
- Remove anonymous users: Y
- Disallow root login remotely: Y
- Remove test database: Y
- Reload privilege tables: Y

### 4. Create Database and User
```bash
sudo mysql -u root -p
```

In MySQL console:
```sql
CREATE DATABASE iiituna_feed;
CREATE USER 'feeduser'@'localhost' IDENTIFIED BY 'feedpass123';
GRANT ALL PRIVILEGES ON iiituna_feed.* TO 'feeduser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 5. Update Application Configuration
Edit `backend/src/main/resources/application.properties`:
```properties
# Uncomment this line to use MySQL
spring.profiles.active=mysql

# Update MySQL credentials in application-mysql.properties
spring.datasource.username=feeduser
spring.datasource.password=feedpass123
```

### 6. Add MySQL Dependency
Edit `backend/pom.xml`:
```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```

## Alternative: Using Root User (Less Secure)

If you want to use root user:

1. **Reset root password:**
```bash
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'yourpassword';
FLUSH PRIVILEGES;
EXIT;
```

2. **Update application-mysql.properties:**
```properties
spring.datasource.username=root
spring.datasource.password=yourpassword
```

## Docker MySQL Setup (Alternative)

If you prefer Docker:
```bash
docker run --name mysql-feed \
  -e MYSQL_ROOT_PASSWORD=rootpass \
  -e MYSQL_DATABASE=iiituna_feed \
  -e MYSQL_USER=feeduser \
  -e MYSQL_PASSWORD=feedpass123 \
  -p 3306:3306 \
  -d mysql:8.0
```

## Troubleshooting

### Common Issues:

1. **Access denied for user 'root'@'localhost'**
   - Root user might not have password authentication enabled
   - Try: `sudo mysql -u root` (without -p)
   - Or reset root password as shown above

2. **Connection refused**
   - MySQL service not running: `sudo systemctl start mysql`
   - Wrong port: Check if MySQL is running on port 3306

3. **Database doesn't exist**
   - Create database: `CREATE DATABASE iiituna_feed;`

4. **Authentication plugin issues**
   - Use mysql_native_password: `ALTER USER 'user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';`

## Current Setup (H2 Database)

The project is currently configured to use **H2 in-memory database** for easy setup:
- ✅ No installation required
- ✅ Works out of the box
- ✅ Perfect for development/demo
- ✅ H2 Console available at: http://localhost:8080/h2-console

To switch to MySQL, follow the setup steps above and uncomment the MySQL profile in `application.properties`.

