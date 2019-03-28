# TAU

The TAU library contains components which allows you to create Web Application UI. Each components represents UI element, such as a button or slider, which gives you interaction and manipulation features.

This is replacement and clone of previously existing https://review.tizen.org/gerrit/#/admin/projects/platform/framework/web/tau

## Getting Started

- Clone a copy of the master branch in the TAU Git repository:

`git clone git@github.com:Samsung/TAU.git`

- Change to the tau directory:

`cd TAU`

- Check out the latest version of TAU:

`git checkout tizen_X.Y`

eg. `git checkout tizen_4.0`

### Prerequisites

To build a TAU library, ensure that you have both Git and Node.js (6.16.0) installed.

Example install using `nvm`:

```
nvm install 6.16.0
nvm alias default 6.16.0
```

- Test that you have grunt installed:

`grunt -V`

If grunt is not installed, then run:

`(sudo) npm install -g grunt-cli`

### Installing

- Install the build module by npm:

`npm install`

Build TAU by running the following command in the tau directory:

`grunt build`

## Running the tests

TAU has automated tests. For run tests execute command:

`grunt test`

## Demo application:

UIComponents sample web application demonstrating how to implement UI Components for wearable based on TAU.

Path in repository:

mobile: `examples\mobile\UIComponents`

wearable: `examples\wearable\UIComponents`

- Install http-server

`npm install http-server -g`

- Launch server in app directory:

`http-server -p <port> -a localhost`

eg. `http-server -p 8888 -a localhost`


### Coding style tests

Project has defined eslint rules (.eslintrc.js)

Contribution can be verified using command:

`grunt eslint`

## Usage

Refer to [samsung.github.io/TAU](https://samsung.github.io/TAU/) for library usage instructions

## Contributing

Please read [CONTRIBUTING.md](https://github.com/Samsung/TAU/blob/master/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

You can find releases in the releases [tab](https://github.com/Samsung/TAU/releases)

Each release number is composed from two parts: 

**Tizen_version_number.TAU_version_for_given_Tizen_release.**

E.g. in case of TAU for Tizen 5.0: 5.0.0...5.0.10, 5.0.11...

## Authors

* Authors - [AUTHOR](https://github.com/Samsung/TAU/blob/master/AUTHOR)

See also the list of [contributors](https://github.com/SAMSUNG/TAU/contributors) who participated in this project.

## License

This project is licensed under MIT except some files under Flora license. For details see [COPYING](https://github.com/Samsung/TAU/blob/master/COPYING)
