FROM python:2.7-alpine

COPY requirements.txt /
RUN pip install -r /requirements.txt

WORKDIR /usr/src/app

COPY . .

ENTRYPOINT [ "python" ]

EXPOSE 3002
CMD [ "pay_validation.py" ]
