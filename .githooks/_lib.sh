# shellcheck shell=sh
# Shared helpers for git hooks. Sourced, not executed.

GREEN='\033[0;32m'
RESET='\033[0m'

ok() { printf "${GREEN}%s${RESET}\n" "$1"; }

run_parallel() {
  label="$1"
  out=$(mktemp)
  shift
  ( "$@" >"$out" 2>&1 ) &
  pid=$!
  eval "pid_$label=$pid"
  eval "out_$label=$out"
}

wait_step() {
  label="$1"
  eval "pid=\$pid_$label"
  eval "out=\$out_$label"
  if wait "$pid"; then
    rm -f "$out"
    ok "✔ $label passed"
  else
    status=$?
    echo "------ $label failed ------"
    cat "$out"
    rm -f "$out"
    exit $status
  fi
}
