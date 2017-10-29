#!/bin/bash

exitcode=0

cp Contents/Scripts/bundle.min.js Contents/Scripts/bundle.min.js.tmp

script/build

if ! cmp -s Contents/Scripts/bundle.min.js Contents/Scripts/bundle.min.js.tmp; then
  echo "The source of launchbar-github has changed but the corresponding bundle.min.js file has not."
  echo
  echo "Please run \`script/build\` and commit the resulting changes."

  if [ -n "$DEBUG" ]; then
    git diff Contents/Scripts/bundle.min.js Contents/Scripts/bundle.min.js.tmp
  fi

  exitcode=1
fi

rm Contents/Scripts/bundle.min.js.tmp

exit $exitcode
