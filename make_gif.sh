#!/bin/bash
coffee --compile *.coffee
node frame.js
convert -size 960x150 -delay 4 -loop 0 target/frames/frame*.svg target/animated.gif