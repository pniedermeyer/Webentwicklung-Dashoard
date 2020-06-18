FROM library/httpd:alpine
RUN echo "Include conf/webenw_services.conf" >> /usr/local/apache2/conf/httpd.conf
COPY webenw_services.conf /usr/local/apache2/conf/webenw_services.conf