FROM python:2.7.14

RUN apt-get update
RUN curl "https://bootstrap.pypa.io/get-pip.py" -o "get-pip.py"
RUN python get-pip.py

WORKDIR /payment-validation

RUN pip install flask

ENTRYPOINT [ "python" ]

CMD [ "pay_validation.py" ]
