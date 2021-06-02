# Delete Workflow Runs

Automatically delete old GitHub Action workflow runs

https://user-images.githubusercontent.com/458691/120520312-a298b580-c3a1-11eb-944d-b65dfa55b869.mp4

By default, this userscript will keep the first (i.e. the latest) workflow run. The number of runs to preserve can be configured in the settings.

## Installation Guide

1. Install a Userscript manager for your web browser
    * [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) (Firefox)
    * [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Firefox, Safari, Edge)

2. [Download the latest build](https://github.com/Trinovantes/userscript-delete-workflow-runs/releases/download/latest/userscript-delete-workflow-runs.user.js). If you have Greasemonkey or Tampermonkey installed, then you should immediately be prompted with a confirmation window asking you if you wish to install this Userscript.

## Dev Guide

1. Install prereqs

    * `node`
    * `yarn`
    * Tampermonkey on Chrome

2. In Chrome:

    * Go to `chrome://extensions/`
    * Go into Tampermonkey's details
    * Enable `Allow access to file URLs`

3. Run dev server

    ```
    yarn install
    yarn dev
    ```

4. In Chrome:

    * Go to `http://localhost:8080/userscript-delete-workflow-runs.proxy.user.js` and install the script
