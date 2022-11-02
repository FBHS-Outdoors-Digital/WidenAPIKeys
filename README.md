# WidenAPIKeys
Google Cloud Function for Widen Api Key Protection
Simple Proxy to Hide our API Keys

## EndPoint
https://us-central1-widenapi.cloudfunctions.net/DV/

## Usage
### Example
`curl https://us-central1-widenapi.cloudfunctions.net/DV/https:/api.widencollective.com/v2/assets/search?query=acn:%7BFypon%20Literature%20-%20Polyurethane,%20PVC%20Column%20Wraps%20and%20QuickRail%20Systems%7D&expand=embeds,metadata,thumbnails&limit=100&scroll=true&sort=`
### Instructions
Prepend your Call to the Widen API with Above Endpoint
## Allowed Widen Enpoints 

### Current 
  * "Assets/search"
  
### Update White List 
![image](https://user-images.githubusercontent.com/54558961/199531429-a61e0c8b-aa93-4f2b-896f-257ebb8e115a.png)

Add desired endpoint to "whiteList" array as well as this readMe

## Codebase

Codebase is currently stored in the google cloud console, must log in as ttdoors@gmail.com to edit
