synesthesize || 共感 [gong gan]
==============================
This project is my capstone project done during my last week and a half completing the 10 week full time web development bootcamp at Brainstation Vancouver.

v.1.0
- currently taking MIDI input only, simply plug in a MIDI player, run the program and watch your music visualize in 3 dimensional space

Synesthesia is a perceptual phenomenon in which stimulation in one sensory field will cause involuntary experiences in another sensory domain. Those afflicted with synesthesia may oftentimes experience visual effects when hearing sounds or experience bodily sensations when seeing a color. This would be a form of projective synesthesia which is the inspiration for this project.

Have you ever been to a show and watched a dj or band play amazing music but wish there was something more exciting to watch? Most musicians would love to provide a visual experience for their audience as well but the barriers to entry are high. Visuals are time-consuming or costly for a musician struggling to make ends meet.  

共感 removes those barriers and simply analyzes an audio input and uses certain preprogrammed visuals and predefined behaviours to produce spectacular patterns and visualizations  

共感 (Gòng gǎn) is a web application for the musically inclined to input live audio into software that provides visualizations that are audio reactive and provide a synesthetic experience for the audience member. 共感 provides a low-barrier method to a new perceptual experience. 

// ![screenshot](/screenshot.png)

## using synesthesize on your computer
after cloning install all node dependencies
```bash
npm i
```
then launch the main task to open budo livereload server  
```bash
npm start
```
you are ready to go !

if you need a minified build just run
```bash
npm run build
```

this project is a work in progress. some future plans include: 

v.2
- Live audio input from other software such as Ableton Live, Serato DJ, Native instruments etc. 
- Database to store audiovisual performance for future reference
- Ability to add extra effects during performance

v.3
- Login/Authentication for users
- Joining private screens/music rooms
- Software stage rather than a simple web app
- Ability to add own visuals and own effects

v.4
- mobile application



Many thanks to @superguigui for his three.js preloader starter kit 
