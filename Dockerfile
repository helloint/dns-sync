# 使用官方的 Node.js 镜像作为基础镜像
FROM node:20-slim

# 创建工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制项目文件
COPY . .

# 安装cronie用于定时任务
RUN apt-get update && apt-get install -y cron

# 复制crontab文件到容器中
COPY crontab /etc/cron.d/mycron

# 给crontab文件添加执行权限
RUN chmod 0644 /etc/cron.d/mycron

# 应用crontab文件
RUN crontab /etc/cron.d/mycron

# 创建cron的运行日志文件
RUN touch /var/log/cron.log

# 启动容器时运行crond和Node.js应用程序
CMD cron && tail -f /var/log/cron.log
