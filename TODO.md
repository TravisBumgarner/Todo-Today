# PR-2 - Let's get to Using It

- [x] Add a Reports Generator
- [x] Add basic electron setup
- [x] Bundle App
- [x] Setup Menu for Electron
- [x] Setup Icon for Electron
- [x] Add previews for state changes
- [ ] Add Saving 
    - [x] Get SQL Lite Installed
    - [ ] Figure out why console logs aren't showing in build
    - [ ] Figure out where the heck the index.html file is coming from
        - Looks like `mainWindow.loadFile(path.join(__dirname, './react-dist/index.html'))` doesn't work
        - I wonder if the issue is with the if / else block with `isDev`
        - Now it's just a white screen...
        - ... Autosave was off
    - [ ] How to elegantly handle the react-dist folder

Next PR

- [ ] Get Hot reloading working
- [ ] Add external export
    - [ ] As CSV
    - [ ] As JSON
- [ ] Add other things you might want to track in a day
- [ ] How to handle 'reoccurring projects' such as PTO and Sick time 
- [ ] More settings
     - [ ] What's your work date
     - [ ] When would you like reminders?

# Things to Noodle On

- Which filters should be added
- What to do with Projects Like PTO / Vacation