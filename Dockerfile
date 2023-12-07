FROM --platform=linux/amd64 python:3.9-slim

# FROM python:3.9-slim

WORKDIR /Repli-Insta

RUN pip install --no-cache-dir --upgrade pip
RUN apt-get update && apt-get install -y pkg-config

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

# 設定工作目錄
WORKDIR /Repli-Insta/src

# 暴露應用程式執行的端口
EXPOSE 3100

# 使用 supervisord 啟動多個進程
CMD ["python", "manage.py", "runserver"]