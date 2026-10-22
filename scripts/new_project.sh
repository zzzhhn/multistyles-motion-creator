#!/bin/zsh
# Start a new multi-style film project from one of the bundled worked examples.
# usage: new_project.sh <new project dir> [xiyou|jieqi]
#   xiyou (default): gallery-wall skeleton (camera pans along framed panels, the cast walks across the seams), 《八十一难》.
#   jieqi: fixed-place skeleton (one composition through time, a story track for the cast, phenomenon transitions,
#          engine-level title cards, a sundial intro, an Art Lock page), 《二十四节气》.
# Then port it: references/03-engine.md (the porting notes of each engine) and references/10-story.md for the jieqi engine.
set -e
dst=${1:?new project dir}
kind=${2:-xiyou}
here=${0:A:h}
if [ -e "$dst" ] && [ -n "$(ls -A "$dst" 2>/dev/null)" ]; then echo "refusing: $dst exists and is not empty"; exit 1; fi
mkdir -p "$dst"/{out,qa,refs}
if [[ $kind == jieqi ]]; then
  ex="${here}/../assets/example-jieqi-24"
  cp -R "$ex/artlock" "$ex/tools" "$dst/"
  cp "${here}/../templates/ARTLOCK_BRIEF.md" "${here}/../templates/UNIT_BRIEF-beats.md" "${here}/../templates/STORY_BRIEF.md" "$dst/"
  cp "${here}/scan.py" "$dst/tools/"
  echo "created $dst (jieqi engine)"
  echo "next: rewrite artlock/terms.js (units), artlock/scene*.js (the fixed composition), artlock/storydata*.js (the story),"
  echo "      keep a few styles in artlock/styles/ to learn from and stub the rest, then:"
  echo "      node tools/storycheck.cjs && node tools/castsheet.cjs 1-4 && node tools/shot.cjs 0"
  echo "      music: write artlock/score-*.js, check with node tools/scorecheck.cjs; the sampled render needs \$AUDIO_TOOLS (references/06-music.md)"
else
  ex="${here}/../assets/example-xiyou-81nan"
  cp -R "$ex/src" "$ex/tools" "$dst/"
  cp "$ex/CELL_GUIDE.md" "$dst/CELL_GUIDE.example.md"
  cp "${here}/../templates/TEAM_BRIEF.md" "$dst/TEAM_BRIEF.template.md"
  cp "${here}/../templates/lead-sheet-skeleton.js" "$dst/src/score-skeleton.js"
  echo "created $dst (xiyou engine)"
  echo "next: replace src/cells.js (bible), the characters and castAt in src/rig.js, the title texts in src/film.js and src/platform.js,"
  echo "      keep 3-5 example styles you want to learn from and delete the rest (also from src/film.html), then:"
  echo "      node tools/still.cjs src/film.html qa/first 3,20 0.5"
fi
