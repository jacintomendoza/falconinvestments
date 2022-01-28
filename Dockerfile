FROM python:latest

# FROM httpd

# RUN apt-get update
# RUN apt-get -y install python

# RUN mkdir -p /data
# WORKDIR /data

COPY /dist/falconfrontend .

EXPOSE 8222

CMD python3 -m http.server 8222

# CMD python -m SimpleHTTPServer 8222

# Running a linux environment inside of a MAC

############# DOCKER COMMANDS
# docker build -t falconfrontenddocker .
# docker run -p 8222:8222 falconfrontenddocker
