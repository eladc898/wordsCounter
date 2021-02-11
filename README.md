# Lemonade Home Exercise

A REST API to count words from text/url/text-file, and get statistics for a single word.

## Getting Started

These instructions will get you a copy of the server up and running on your local machine for development and testing purposes.

### Prerequisites
1. git
2. node
3. local mongoDB

## How to install and run

git clone https://github.com/eladc898/wordsCounter.git

cd wordsCounter

npm install

run scripts from package.json. to use them run
npm run [command] where command is one of the following:
- ```start``` starts the server
- ```test``` runs all tests(note that the server should be up while running test)

##API documentation
* **Count words** - a POST request to **/count** \
  Request body: a ```type``` ('text', 'file', 'url') and a ```payload``` containing the data to be processed (text, URL or file path) as request body.
  

* **Word statistics** - a GET request to **/statistics** \
  Query Param: ```word```(String), count statistics for the given word

## Usage

1. Count words from text(string) in request body\
   `curl --location --request POST 'http://localhost:3000/api/v1/word/count' \
   --header 'Content-Type: application/json' \
   --data-raw '{
   "payload": "Hi! My name is (what?), my name is (who?), my name is Slim Shady",
   "type": "text"
   }'`

2. Count words from URL(string) in request body\
   `curl --location --request POST 'http://localhost:3000/api/v1/word/count' \
   --header 'Content-Type: application/json' \
   --data-raw '{
   "payload": "http://127.0.0.1:4000/api/v1/user",
   "type": "url"
   }'`

3. Count words from file path(string) in request body\
   `curl --location --request POST 'http://localhost:3000/api/v1/word/count' \
   --header 'Content-Type: application/json' \
   --data-raw '{
   "payload": "C:/Users/Elad/Downloads/testFiles/10MB.txt",
   "type": "file"
   }'`

4. Get statistics for a word\
   `curl --location --request GET 'http://localhost:3000/api/v1/word/statistics?word=my'`


## Tests
Unit tests for word counting and integration tests for implemented routes 

## Built With
* **Node - express**
* **MongoDB(mongoose library as ORM)**

## Author
**Elad Cohen**
