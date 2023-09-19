# OctoPrint-WebcamExtras

Zoom, fullscreen and minimize the webcam view

## Setup

Install via the bundled [Plugin Manager](https://docs.octoprint.org/en/master/bundledplugins/pluginmanager.html)
or manually using this URL:

    https://github.com/poulou0/OctoPrint-WebcamExtras/archive/refs/heads/main.zip

## Compatible with:
* Default theme
* [Dashboard](https://plugins.octoprint.org/plugins/dashboard/)
* [UI Customizer](https://plugins.octoprint.org/plugins/uicustomizer/) (uncheck "Float/Fullscreen webcam" on the settings)
* [Themeify](https://plugins.octoprint.org/plugins/themeify/)
* [MultiCam](https://plugins.octoprint.org/plugins/multicam/)

:))

## Known issues
* Rotated webcam
* Multicam, camera menu on floating window

## Development environment
### Octoprint dev
> https://docs.octoprint.org/en/master/development/environment.html#linux

#### TL:DR
```shell
sudo apt-get install python3 python3-pip python3-dev python3-setuptools python3-virtualenv git libyaml-dev build-essential
```
```shell
cd ~/Projects
git clone https://github.com/OctoPrint/OctoPrint.git
cd OctoPrint
virtualenv --python=python3 venv
source ./venv/bin/activate
pip install --upgrade pip
pip install -e '.[develop,plugins,docs]'
pre-commit install
git config blame.ignoreRevsFile .git-blame-ignore-revs
```
```shell
source ./venv/bin/activate
octoprint serve
```
Listening on `http://0.0.0.0:5000` and `http://[::]:5000`
### Plugin dev
> https://docs.octoprint.org/en/master/plugins/gettingstarted.html

#### TL:DR
```shell
cd ~/Projects
git clone git@github.com:poulou0/OctoPrint-WebcamExtras.git
cd OctoPrint-WebcamExtras
source ../OctoPrint/venv/bin/activate
octoprint dev plugin:install
```
#### Test webcams:
* Kirchhoff Institute for Physics, Germany
    * http://pendelcam.kip.uni-heidelberg.de/mjpg/video.mjpg
* International Center for Hellenic and Mediterranean Studies (DIKEMES), Athens
    * http://view.dikemes.edu.gr/mjpg/video.mjpg

### Publish
Make a new release with the corresponding tag.
> https://github.com/poulou0/OctoPrint-WebcamExtras/releases/new
