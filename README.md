# Edge Analytics
A single point dashboard for managing Edge devices
The main objective of this project is to deploy and run machine learning models on the edge.


## Techstack 
* ReactJS
* Nodejs
* RabbitMQ
* DynamoDB
* AWS S3
* Jetson TX3 
* Tensorflow
  
## Architecture
![Architecture Diagram](https://github.com/mhn10/edge-analytics-dashboard/blob/master/readme_assets/Edge_analytics_arch.png)

### How to run
* make sure node and npm in installed. [here](https://nodejs.org/en/)

Clone this repo 
```bash 
git clone https://github.com/mhn10/edge-analytics-dashboard
```

#### Frontend
Change into directory of frontend
```bash
cd Frontend
```
Install node packages 
```bash
npm install
```
or through yarn
```bash
yarn install
```
Once the packages are installed, perform npm start
```bash
npm start
```

#### Server
Change into directory of Backend
```bash
cd Backend
```
Install node packages 
```bash
npm install
```
or through yarn
```bash
yarn install
```
Once the packages are installed, run the file
```bash
node index.js
```

#### Jetson

## Credits
Mentor - Kaikai Liu

Lead Developers - 
Mithun Harikumar Nair (@mhn10)
Pavan Kumar Shekar (@PavanKumarShekar)
Ragvendra Dixit (@raghvendra1218)
Sahil Sharma (@Sahil12S)

 
## License
 
The MIT License (MIT)

Copyright (c) 2015 Chris Kibble

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.