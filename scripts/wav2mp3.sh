#!/usr/bin/env bash

# compress all .wav-files in current dir to 192 kbps mp3

for f in *.wav ; do ffmpeg -i "$f" -vn -ar 44100 -ac 2 -b:a 192k "$f".mp3 ; done
