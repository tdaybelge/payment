FROM python:2.7.14

RUN apt-get update
RUN curl "https://bootstrap.pypa.io/get-pip.py" -o "get-pip.py"
RUN python get-pip.py

WORKDIR /usr/src/app

RUN pip install flask

COPY . .

ENTRYPOINT [ "python" ]

EXPOSE 80
CMD [ "pay_validation.py" ]
