#!/bin/bash
gnome-terminal --geometry 75x21+55+21 --window-with-profile=Hold  --working-directory=/home/denny/workspace/robotwar -e "node index"
gnome-terminal --geometry 75x21+55+2000 --window-with-profile=Hold  --working-directory=/home/denny/workspace/robotwar -e "node server"
#gnome-terminal --geometry 75x21+1000+14 --window-with-profile=Hold  --working-directory=/home/denny/workspace/robotwar -e "npm run webpack"
gnome-terminal --geometry 75x21+1000+2000 --window-with-profile=Hold  --working-directory=/home/denny/workspace/robotwar -e "gulp"
