# React, Typescript, Netlify, Vite, TailwindCSS Starter
## What is it:
This is a basic working dev environment for working on a React/Typescript application, including TailwindCSS, and using _next generation tooling_ from Vite. In addition running lambda's from Netlify/Typescript in the same environment.

✅ Tested with `netlify-cli/3.29.7 darwin-x64 node-v15.13.0`<br>
✅ Tested with `netlify-cli/3.29.7 darwin-x64 node-v16.1.0`<br>
✅ Tested with `netlify-cli/3.29.7 darwin-x64 node-v12.0.0`

## Installation:
⚠️ This assumes you have the [netlify-cli](https://docs.netlify.com/cli/get-started/) installed.
<br>First [fork](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo) this repo and then clone your fork, then:
```
npm install
```
```
netlify init
```
Configure as you see fit, but the netlify.toml file does specify a build command and you'll need to change that to override it.
```
npm start
```
If you fork the repo, then want to use it again, you might try the following: <br>
1. Create your new repo on GitHub
2. `git clone yournewrepo`
3. `git clone --bare your-fork-of-this-starter`
4. `cd your-fork-of-this-starter`
5. `git push --mirror yournewrepo`
6. `rm -rf your-fork-of-this-starter.git`
7. `rm -rf yournewrepo`
8. `git clone yournewrepo`

## Netlify Endpoint:
You're netlify endpoint is now: localhost:3000/api/{function} <br>
You can tell you are on the proper localhost port, because when you start the server vite tells you:
```
[⚡️vite]   > Local: http://localhost:3000/
```

## Logging:
I like seeing typescript errors in my console, as well as using VS Code, or any other modern text editor, so we run tsc concurrently with vite and it's HMR. The output then looks something like this:
```
[⚡️vite]   ready in 238ms.
[👹tsc] 4:42:46 PM - Found 0 errors. Watching for file changes.
```

### Change this:
You can change this inside package.json, the "dev" script.
```json
"concurrently -n \"⚡️vite,👹tsc\" -c \"cyan,red\" \"vite\" \"tsc -w\""
```
-n specifies to names for each command output
<br>-c specifies the color for each command output
<br>If you don't want to see any tsc errors in the command line, just remove "-w". This means that you will see typescript errors on the inital vite build, but not after that.

## Build:
Currently it is set to error before build if typescript errors don't pass. This means that Netlify won't deploy either, if there are typescript errors. Based on the tsconfig.json, we are also checking the functions folder when we run tsc.

### Change this:
You can change this inside package.json, the "build" script.
```json
"tsc && vite build"
```
Just remove tsc, but remember that it can be nice to be notified of potential errors before you build.

## Deployment:
Netlify is awesome, so you can actually just deploy your app by pushing to whatever branch you have Netlify watching.
<br>You can deploy a draft with:
```
netlify deploy
```
Or if you want it in production
```
netlify deploy --prod
```
The starter kit's deployed site is [here](https://r-ts-v-tw-starter.netlify.app).
