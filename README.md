# GitHub LaunchBar Action

This is a GitHub [LaunchBar](https://www.obdev.at/products/launchbar) action
that can search various parts of GitHub based on your input.

## Actions

At any point you can either hit enter to navigate into available options, or
hit `⌘` + `enter` to go directly to the corresponding GitHub page.

### For a user or organization

![](screenshots/default.png)
![](screenshots/user.png)
![](screenshots/user-expanded.png)
![](screenshots/user-repos-expanded.png)

### For a repository

![](screenshots/default.png)
![](screenshots/repo.png)
![](screenshots/repo-expanded.png)

### For an issue or pull request

![](screenshots/default.png)
![](screenshots/issue.png)

### Shortening a link

At any time, paste a GitHub link into LaunchBar and hit `tab`. Start typing
"github" and you should see the action appear, hit `enter`. Once complete, the
action will ask you if you want to shorten the link, hit `enter` and the
shortened link will be copied to your clipboard.

![](screenshots/shorten-link.png)
![](screenshots/shorten-link-expanded.png)
![](screenshots/shorten-link-final.png)

## Installing

Installing should be as simple as cloning this repository to your LaunchBar
Actions folder:

```
git clone https://github.com/bswinnerton/GitHub.lbaction ~/Library/Application\ Support/LaunchBar/Actions
```
