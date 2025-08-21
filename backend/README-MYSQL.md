# MySQL Database Setup for Feed Backend

## Prerequisites
- MySQL Server 8.0 or higher
- Java 17 or higher
- Maven 3.6 or higher

## Database Setup

### 1. Install MySQL Server
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server

# CentOS/RHEL
sudo yum install mysql-server

# macOS (using Homebrew)
brew install mysql
```

### 2. Start MySQL Service
```bash
# Ubuntu/Debian/CentOS/RHEL
sudo systemctl start mysql
sudo systemctl enable mysql

# macOS
brew services start mysql
```

### 3. Secure MySQL Installation
```bash
sudo mysql_secure_installation
```

### 4. Create Database and User
```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database
CREATE DATABASE iiituna_feed CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (optional - you can use root)
CREATE USER 'feeduser'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON iiituna_feed.* TO 'feeduser'@'localhost';
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

### 5. Update Configuration
Update the database credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

## Running the Application

### Development Mode
```bash
# Using Maven
mvn spring-boot:run -Dspring.profiles.active=dev

# Using Java
java -jar target/feed-backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
```

### Production Mode
```bash
# Using Maven
mvn spring-boot:run -Dspring.profiles.active=prod

# Using Java
java -jar target/feed-backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

## Environment Variables
You can override database settings using environment variables:
```bash
export SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/iiituna_feed
export SPRING_DATASOURCE_USERNAME=your_username
export SPRING_DATASOURCE_PASSWORD=your_password
```

## Troubleshooting

### Connection Issues
1. Ensure MySQL service is running
2. Check if the database exists
3. Verify username and password
4. Check if the port 3306 is accessible

### Character Encoding Issues
The application is configured with UTF-8 encoding. If you encounter encoding issues:
1. Ensure your MySQL server supports UTF-8
2. Check the database collation
3. Verify the connection string parameters

### Performance Tuning
The application includes HikariCP connection pool configuration. Adjust the pool size based on your needs:
```properties
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=10
```

## Migration from H2
If you're migrating from H2 to MySQL:
1. Backup your H2 data
2. Create the MySQL database
3. Update the configuration files
4. Run the application - JPA will create the tables automatically
5. Import your data if needed
