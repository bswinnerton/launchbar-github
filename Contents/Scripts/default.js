// LaunchBar Action Script

function run(argument) {
  runWithString(argument);
}

function runWithString(string) {
  LaunchBar.openURL('https://github.com/' + string);
}
