# TAU

The TAU library contains components which allows you to create Web Application UI. Each components represents UI element, such as a button or slider, which gives you interaction and manipulation features.

## Getting Started

- Clone a copy of the master branch in the TAU Git repository:

`git clone git@github.com:Samsung/TAU.git`

- Change to the tau directory:

`cd TAU`

- Check out the latest version of TAU:

`git checkout tizen_X.Y`

eg. `git checkout tizen_5.0`

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

## Deployment

@todo

## Built With

@todo

## Contributing

@todo
Please read [CONTRIBUTING.md] for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

@todo

## Authors

* Authors - [AUTHOR]

See also the list of [contributors](https://github.com/SAMSUNG/TAU/contributors) who participated in this project.

## License

This project is licensed under MIT except some files under Flora license. For details see [COPYING]

## Acknowledgments

* @todo