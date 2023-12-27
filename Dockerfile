FROM python:3.9-slim

WORKDIR /Repli-Insta

COPY . ./

RUN apt-get update && apt-get install -y default-libmysqlclient-dev gcc

ENV MYSQLCLIENT_CFLAGS="-I/usr/include/mysql"
ENV MYSQLCLIENT_LDFLAGS="-L/usr/lib/x86_64-linux-gnu -lmysqlclient"

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

WORKDIR /Repli-Insta/src


# 暴露應用程式執行的端口
EXPOSE 3100

# 使用 supervisord 啟動多個進程
CMD ["python", "manage.py", "runserver"]