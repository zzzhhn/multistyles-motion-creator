#!/bin/zsh
# render-score2.sh: one command from the score (artlock/score-jq2.js) to the two soundtrack files of the film pages.
#   tools/render-score2.sh                 build into qa/audio/jq2/work and install artlock/audio/jq2-{full,loop}.wav + jq2.json
#   tools/render-score2.sh <workdir> noinstall   build elsewhere without installing (the determinism check)
# Steps: lint (tools/scorecheck.cjs) -> score JSON with the terms' impacts (tools/jq2/score2json.cjs) -> measured sample
# tuning (tools/jq2/probe_samples.py; only if tools/jq2/tuning.json is missing) -> dry stems for the full film and the
# loop (tools/jq2/render_jq2.py; Python venv of _audio-tools: numpy, pysfizz, librosa) -> balance, Faust jpverb hall, ride
# and master (tools/jq2/mix_jq2.cjs; the loop reuses the full film's balance) -> measurements (tools/jq2/verify_jq2.py).
# Inputs are read-only: the score, the sample libraries (_audio-tools/vsco2, _audio-tools/samples-cn). Deterministic.
set -euo pipefail
ROOT=${0:A:h:h}
W=${1:-$ROOT/qa/audio/jq2/work}
AT=${AUDIO_TOOLS:-${ROOT:h}/_audio-tools}      # sample libraries (vsco2, samples-cn), the Python venv and the Faust hall
export AUDIO_TOOLS=$AT
PY=$AT/.venv/bin/python
cd "$ROOT"
mkdir -p "$W"
t0=$(date +%s)
node tools/scorecheck.cjs > "$W/scorecheck.txt" || { cat "$W/scorecheck.txt"; exit 1; }
node tools/jq2/score2json.cjs "$W/score.json"
[[ -f tools/jq2/tuning.json ]] || "$PY" -I -B tools/jq2/probe_samples.py > "$W/probe.log"
for m in full loop; do "$PY" -I -B -W ignore tools/jq2/render_jq2.py "$W/score.json" "$W/$m" "$m"; done
node tools/jq2/mix_jq2.cjs "$W/full" "$W/jq2-full.wav" "$W/full.stats.json"
node tools/jq2/mix_jq2.cjs "$W/loop" "$W/jq2-loop.wav" "$W/loop.stats.json" "$W/full.stats.json"
"$PY" -I -B -W ignore tools/jq2/verify_jq2.py "$W" "$W/verify.json" > /dev/null
echo "render-score2: built in $(( $(date +%s) - t0 )) s -> $W"
if [[ "${2:-}" != noinstall ]]; then
  mkdir -p artlock/audio
  cp "$W/jq2-full.wav" "$W/jq2-loop.wav" artlock/audio/
  node -e '
    const fs = require("fs"), [W, out] = process.argv.slice(1), V = JSON.parse(fs.readFileSync(W + "/verify.json"));
    const one = m => { const s = JSON.parse(fs.readFileSync(W + "/" + m + ".stats.json")), meta = JSON.parse(fs.readFileSync(W + "/" + m + "/meta.json"));
      return { file: "jq2-" + m + ".wav", duration: s.duration, sampleRate: s.sampleRate, lufs: V[m].integratedLufs, lra: V[m].lra, truePeakDbtp: V[m].truePeakDbtp,
        sha256: s.sha256, accents: meta.accents.map(a => ({ n: a.n, t: a.t })) }; };
    fs.writeFileSync(out, JSON.stringify({ score: "artlock/score-jq2.js", built: "tools/render-score2.sh", full: one("full"), loop: one("loop") }, null, 1));
  ' "$W" artlock/audio/jq2.json
  echo "render-score2: installed artlock/audio/jq2-full.wav, jq2-loop.wav, jq2.json"
fi
shasum -a 256 "$W/jq2-full.wav" "$W/jq2-loop.wav"
