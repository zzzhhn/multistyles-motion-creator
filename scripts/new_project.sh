#!/bin/zsh
# Start a new multi-style film project from the bundled worked example.
# usage: new_project.sh <new project dir>
# Copies src/ and tools/ (engine, 81 example styles, score, tools) plus CELL_GUIDE/TEAM_BRIEF as starting documents.
# Then port it: references/03-engine.md, section "移植到新题材要改的地方".
set -e
dst=${1:?new project dir}
here=${0:A:h}
ex="${here}/../assets/example-xiyou-81nan"
if [ -e "$dst" ] && [ -n "$(ls -A "$dst" 2>/dev/null)" ]; then echo "refusing: $dst exists and is not empty"; exit 1; fi
mkdir -p "$dst"/{out,qa,refs}
cp -R "$ex/src" "$ex/tools" "$dst/"
cp "$ex/CELL_GUIDE.md" "$dst/CELL_GUIDE.example.md"
cp "${here}/../templates/TEAM_BRIEF.md" "$dst/TEAM_BRIEF.template.md"
cp "${here}/../templates/lead-sheet-skeleton.js" "$dst/src/score-skeleton.js"
echo "created $dst"
echo "next: replace src/cells.js (bible), the characters and castAt in src/rig.js, the title texts in src/film.js and src/platform.js,"
echo "      keep 3-5 example styles you want to learn from and delete the rest (also from src/film.html), then:"
echo "      node tools/still.cjs src/film.html qa/first 3,20 0.5"
