#!/bin/zsh
# Timestamped contact sheet of a video.
# usage: contact_sheet.sh <video> <out.jpg> [fps=1] [cols=10] [thumbW=320] [start=0] [duration=all]
#   fps 0.25 = one frame every 4 s; keep cols × rows under ~120 frames per sheet so it stays readable.
# ffmpeg's drawtext needs an explicit fontfile here (no fontconfig configuration on this machine).
set -e
src=${1:?video}; out=${2:?out.jpg}; fps=${3:-1}; cols=${4:-10}; tw=${5:-320}; ss=${6:-0}; dur=${7:-}
font=/System/Library/Fonts/Supplemental/Arial.ttf
len=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$src")
[ -n "$dur" ] || dur=$(python3 -c "print(max(0.1, $len - $ss))")
n=$(python3 -c "import math; print(max(1, math.ceil($dur * $fps)))")
rows=$(python3 -c "import math; print(math.ceil($n / $cols))")
ffmpeg -hide_banner -loglevel error -y -ss "$ss" -t "$dur" -i "$src" \
  -vf "fps=${fps},scale=${tw}:-1,drawtext=fontfile=${font}:text='%{pts\:hms\:${ss}}':x=6:y=6:fontsize=16:fontcolor=white:box=1:boxcolor=black@0.7,tile=${cols}x${rows}" \
  -frames:v 1 "$out"
echo "$out  (${n} frames, ${cols}x${rows}, every $(python3 -c "print(round(1/$fps, 3))") s from ${ss} s)"
