FROM python:3
RUN mkdir /shelterly
COPY . /shelterly/
WORKDIR /shelterly/
RUN pip install --no-cache-dir -r  config/requirements.txt \
    && curl -sL https://deb.nodesource.com/setup_13.x | bash - \ 
    && apt-get update && apt-get install -y nodejs
RUN mkdir frontend/node_nodules
RUN npx create-react-app react_modules
RUN mv react_modules/ node_modules/ \
    && mv node_modules/ frontend/
WORKDIR /shelterly/frontend
RUN npm install --save bootstrap
CMD tail -f /dev/null
