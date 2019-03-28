# Contributing guidelines

### Contributing code
If you have improvements to TAU, send us your pull requests! For those just getting started, Github has a [howto](https://help.github.com/articles/using-pull-requests/).

### Commit policy
We recommend that use a 1 commit for the pull request.

### Commit message
OptionalTag: One line title in imperative

[Issue] https://github.com/Samsung/TAU/issues/NN

[Problem] Multiline text containing problem description. It should describe how
issue occured, in which situation, how it differed from expected behaviour. Use
past tense regarding what happened before this commit message.

[Solution] Multiline text containing solution description. It should describe
how problem was fixed.

[Remarks] Optional section containing additional comments on change, its
connection to other repositories, announcement of forthcoming changes related
to issue, etc.

[Test] Optional section describing how to test change after applying it. 
Added if it deviates from currently documented test methods.

Signed-off-by: info added when `git commit` ran with `-s` option

### Coding styles
Project has defined eslint rules (.eslintrc.js)
We recommend to run "grunt eslint" before uploading a pull request.

### Review policy
Assign Reviewer in Reviewers panel.
PR can be merged by TAU Reviewers only.

##### TAU reviewers:
Hunseop Jeong (hs85.jeong@samsung.com),
KwangHyuk Kim (hyuki.kim@samsung.com),
Lukasz Slachciak (l.slachciak@samsung.com),
Tomasz Lukawski (t.lukawski@samsung.com)

