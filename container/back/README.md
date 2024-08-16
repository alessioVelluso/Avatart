# INITIAL TYPESCRIPT NODE PROJECT

## Best dev experience tools for a node-based fast application.
> Typescript with ESM syntax and some gentle .eslint rules that impose the massive use of types for developers

1. Have node installed
2. Download the repo
3. `npm install` in your terminal
4. `npx eslint .` to impose the lint rules
5. *(edit .env variables if db needed)*

### You than have two npm scripts:
1. `npm run dev`
      - *Starts the application and listen to the default **.env** server_port 3000*
      - *Runs through nodemon so every change restart the server*
2. `npm run update-models [bash console]` *~(not required)*
      - *After configuring the related **.env** vars, this script download all your db entities as a sequelize model*
      - If you're not gonna use a db, ignore this script, the folder /models and the related .env vars as well.
    > This is made thanx to `sequelize` and especially `sequelize-auto` that connects to our db and\
    > retrieves all the information needed to build your model starting from the db 
