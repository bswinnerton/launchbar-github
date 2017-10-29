#!/bin/bash

exitcode=0

cp Contents/Scripts/bundle.min.js Contents/Scripts/bundle.min.js.tmp

script/build

if ! cmp -s Contents/Scripts/bundle.min.js Contents/Scripts/bundle.min.js.tmp; then
  babel_version="$(./node_modules/.bin/babel --version)"

  echo "The source of launchbar-github has changed but the corresponding bundle.min.js file has not."
  echo
  echo "Please ensure you are running Babel version $babel_version, and then run \`script/build\` and commit the resulting changes."

  if [ -n "$DEBUG" ]; then
    git --no-pager diff Contents/Scripts/bundle.min.js Contents/Scripts/bundle.min.js.tmp
  fi

  exitcode=1
fi

rm Contents/Scripts/bundle.min.js.tmp

exit $exitcode
