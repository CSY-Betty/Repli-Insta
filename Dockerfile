# 第一階段：使用 Node.js 的基礎映像安裝 Node.js 相依套件
FROM node:14 AS node_build
WORKDIR /Repli-Insta
COPY package*.json /Repli-Insta/
RUN npm install

# 第二階段：使用 Python 的基礎映像安裝 Python 相依套件
FROM python:3.9-slim AS python_build
WORKDIR /Repli-Insta

COPY --from=node_build /Repli-Insta/node_modules ./node_modules
COPY . .

RUN pip install --no-cache-dir -r requirements.txt


# 設定工作目錄
WORKDIR /Repli-Insta/src

# 暴露應用程式執行的端口
EXPOSE 3100

# 同時啟動 Python 和 Node.js，根據您的實際應用程式指定相應的命令
CMD ["sh", "-c", "python app.py & npm run dev"]
