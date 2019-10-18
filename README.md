EWI-USB Config
==============

Configures a [particular device](https://www.akaipro.com/ewi-usb) through WebMIDI using [JZZ](https://jazz-soft.net/doc/JZZ/) with SysEx MIDI data provided by [EWIUSB.com](https://ewiusb.com). Uses [Ionic](https://ionicframework.com/) on [React](https://reactjs.org/).

Hosted [on Firebase](https://ewi-usb-config.web.app) unless something happened.

MIT licensed. See `LICENSE.txt` for details.

Support & Compatibility
-----------------------

Please open a GitHub issue if you're having problems or want to make a suggestion.

This was only tested on Chrome v77 on Windows 10. [Other browsers](https://caniuse.com/#feat=midi) most likely won't work even in 2019.

Purpose
-------

The vendor-supplied configuration program doesn't work for me (at all) and isn't well supported anymore.

So I wrote my own configuration utility that runs in a web browser.

Usage
-----

1. Close ANY/ALL applications that might be actively using your EWI-USB device (including DAWs/audio programs, etc).
2. Ensure your device is plugged into the computer you want to run this app on.
3. Open website
4. Accept prompt to use MIDI (if it shows up)
5. Select MIDI devices to use from the dropdown. Both MIDI IN and MIDI OUT should be EWI-USB.
6. Click 'Open MIDI Devices'
7. Move a slider randomly (just to be different, this is totally optional)
8. Click "Fetch Data" to read the current settings from the device. If this was successful, that slide your moved in Step 6 will jump to a new position. Other sliders might too depending on your device's current configuration.
9. Move sliders 'til the device is configured about right.
10. Click "Save" button to commit the settings to the device. Repeat steps 7 and 8 if you like.
11. When finished, close the browser completely (in the future, there might be a 'Close MIDI Devices')
12. Open your MIDI-enabled Digital Audio Workstation (DAW) and enjoy your newly-configured device.

Troubleshooting
---------------

If 'Fetch Data' or 'Save' doesn't seem to do anything, your device is probably in use by another application.

Try unplugging your device, closing all MIDI applications, waiting a few seconds, plugging it back in, then reload the application until the device shows up, and try your configuration again.

Installation
------------

You'll need Node.js, npm, npx, and yarn because this is a JavaScript program.

1. yarn install

Running in Dev Mode
-------------------

1. ionic serve

Building for the Web
--------------------

Build/update as a Progressive Web App (PWA).
Assumes Firebase (and you probably need to be on the "firebase" branch if it still exists in this repository).

1. npx cap copy web
2. ionic build --prod
3. firebase deploy

Building a Desktop App
----------------------

This isn't supported yet. Probably through Ionic Capacitor and Electron.js. In the mean time use "Dev Mode" or the hosted website.

DISCLAIMER
==========

This web site/software is not endorsed by, directly affiliated with, maintained, authorized, or sponsored by [Akai Professional](https://akaipro.com/). All product and company names are the registered trademarks of their original owners. The use of any trade name or trademark is for identification and reference purposes only and does not imply any association with the trademark holder of their product brand. The information/data received and transmitted by this software was provided by independent observations from [EWIUSB.com](https://ewiusb.com/) and is believed to be accurate and safe. However, THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
