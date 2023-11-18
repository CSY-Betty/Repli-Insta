# 第一階段：使用 Node.js 的基礎映像安裝 Node.js 相依套件
FROM node:14 AS node_build
WORKDIR /Repli-Insta
COPY package*.json /Repli-Insta/
RUN npm install

# 在 Node.js 安裝相依套件的步驟後，添加 npm 命令的目錄到 PATH
ENV PATH=/Repli-Insta/node_modules/.bin:$PATH

# 第二階段：使用 Python 的基礎映像安裝 Python 相依套件
FROM --platform=linux/amd64 python:3.9-slim AS python_build
WORKDIR /Repli-Insta

COPY --from=node_build /Repli-Insta/node_modules ./node_modules
COPY . .

RUN pip install --no-cache-dir -r requirements.txt

# 安裝 supervisord
RUN apt-get update && apt-get install -y supervisor

# 設定 supervisord 的配置檔
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf


# 設定工作目錄
WORKDIR /Repli-Insta/src

# 暴露應用程式執行的端口
EXPOSE 3100

# 使用 supervisord 啟動多個進程
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
