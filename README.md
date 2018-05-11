# SERP connect

This is the frontend repository of the SERP-connect [project](https://serpconnect.cs.lth.se). It contains a working example of a frontend.

## Getting Started
Make sure you have downloaded and set up the [backend](https://github.com/emenlu/connect) first.

 1. Make sure [nodejs](https://nodejs.org/en/) (v5 or v6) is installed. 
 1. Clone this project `git clone https://github.com/serpconnect/website template`
 1. Install modules `cd template && npm install`
 1. Get submodules `git submodule update --init`

Now you are ready to start developing! Here are some useful make targets:

 - `npm run dev` to start dev server & watch files
 - `npm run live` to test with live backend
 - `npm run build` to compile less/~jade~pug/js and tarball them to frontend.tgz

## Project Structure
The topmost level has these 4 folders:

 - `scripts`: scripts that build the website
 - `src`: source folder for website (less/js/~jade~pug)
 - `shared`: source folder for common components across many frontends
 - `bin`: (generated) output folder (html/js/css)

## What building the website means
The project uses ~jade~pug, less and javascript. Both ~jade~pug and less files must be compiled to html and css, respectively. Since we also target older browsers our javascript must be backwards-compatible, which is handled by babel. 

These are the steps taken to build the website:

 - copies/babel-transform js
 - compiles less
 - renders ~jade~pug
 	- production mode (BUILD_MODE=prod): use api from api.serpconnect.cs.lth.se
 	- development mode (BUILD_MODE=dev, default): use api from localhost:8080
 - copies images

## Testing
We used phantomjs to test certain parts of the website. But this tool has now been replaced with headless browsers and we have not yet explored this territory.

## Submodules
first time clone:
```sh
$ git clone https://github.com/serpconnect/website
$ cd website
$ git submodule init
$ git submodule update --recursive
```

update all submodules to latest commit:
```sh
git submodule update --recursive --remote
```
