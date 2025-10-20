# <img width="400" alt="image" src="https://github.com/user-attachments/assets/a30ba99a-5bd9-4c82-bad0-0c46e02c4012" />
Built for DubHacks 2025  **-NOTE-github pages will remain up probably but the server it connects to will go down as of 10/20/25**

A low overhead web-app that leverages AI to help users find their stuff! Allows users to quickly and effortlessly snap pictures of items they find as well as 
users who lost an item to type a quick description.

## Found
When someone stumbles across an item they think is lost they can simply pull up the app and snap a picture. They can also choose to enter contact infor and a location but its not required-this app is about ease of use so people actually use it!

![ScreenRecording_10-19-2025 20-30-55_1 - SPEED - Videobolt net](https://github.com/user-attachments/assets/8c7b0cb8-33d8-4b86-993a-779a532637bc)

## Lost
When someone notices that they lost one of their items they can pull up the app and click lost. This will allow them to type in a text description and search for 
previously found items.

![Screen Recording 2025-10-19 at 8 41 33 PM (online-video-cutter com)](https://github.com/user-attachments/assets/9a5bff0e-2105-44ba-8672-9f004e676573)

## Tack Stack/how we built it
This project has a fairly large tech stack and taught us a lot about the technologies we chose to employ.

### system architecture
We decided to seperate out our client from the server. This is reflected in our filestructure where there are two folders each containing essentially their own completely independent codebases. These two systems talk to each other and transfer data through api endpoints. 

### client
The client was written using react and typescript. This allowed for a dynamic single page application that could be hosted on a static page service like github pages. This made it easy and quick to deploy our prototype.

### server
We wrote the server in python using flask to controll the api endpoints. Python allowed us to run the AI models we needed and also allowed us to hit aws endpoints to use their vectorstore s3. We decided to run our server on an actual computer then tunnel it to the web using cloudflare. 

### s3 + huggingface encodings
The way our app ends up working is when users upload images they get encoded and added to a vector store. When a user prompts for an item this prompt is encoded then a cosin distance search is preformed to return the vectors that most closely resemble the prompt. To do this we used a huggingface model running locally to make the vector encodings of 1024 dimensions. These encoding are then stored along with metadata in amazons s3 vector store. 





