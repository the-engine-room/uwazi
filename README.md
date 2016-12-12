[![devDependency Status](https://david-dm.org/huridocs/uwazidocs/dev-status.svg)](https://david-dm.org/huridocs/uwazi#info=devDependencies)
[![dependency Status](https://david-dm.org/huridocs/uwazidocs/status.svg)](https://david-dm.org/huridocs/uwazi#info=dependencies)

#Global dependencies

- **NodeJs 4.x**
    - Ubuntu

      ```
      $ curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
      $ sudo apt-get install -y nodejs
      ```
- **Elasticsearch / Logstash** (latest version, 2.1.1)
    - OSX
      - `brew update`
      - `brew install elasticsearch`
      - `brew install logstash`

    - Ubuntu
      ```
      $ wget -qO - https://packages.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
      $ echo "deb http://packages.elastic.co/elasticsearch/2.x/debian stable main" | sudo tee -a /etc/apt/sources.list.d/elasticsearch-2.x.list
      $ sudo apt-get update && sudo apt-get -y install elasticsearch
      $ sudo update-rc.d elasticsearch defaults 95 10

      $ echo "deb https://packages.elastic.co/logstash/2.3/debian stable main" | sudo tee -a /etc/apt/sources.list
      $ sudo apt-get update && sudo apt-get install logstash
      ```
      For adding logstash bin to PATH do:
      ```
      $ sudo vim /etc/profile.d/logstash.sh
      ```
      Add the following line:
      `PATH=$PATH:/opt/logstash/bin`.
      Relog into the system to have the logstash command available.

- **Docsplit**
    - OSX
      - `brew install ruby`
      - `brew install ghostscript`
      - `gem install docsplit`
      - install non optional dependencies for docsplit -> [https://documentcloud.github.io/docsplit/](https://documentcloud.github.io/docsplit/)
    - UBUNTU
      - install ruby `sudo apt-get install ruby-full`
      - `gem install docsplit`
      - install non optional dependencies for docsplit -> [https://documentcloud.github.io/docsplit/](https://documentcloud.github.io/docsplit/)

- **CouchDB and Futon**
    - Ubuntu

      ```
      $ sudo apt-get install software-properties-common -y
      $ sudo add-apt-repository ppa:couchdb/stable -y
      $ sudo apt-get update
      $ sudo apt-get install couchdb -y
      ```

- **pdf2htmlEX**
    - OSX

      ```
      $ brew install pdf2htmlex
      ```
    - Ubuntu

      ```
      $ sudo add-apt-repository ppa:coolwanglu/pdf2htmlex
      $ sudo add-apt-repository ppa:fontforge/fontforge
      $ sudo apt-get update
      $ sudo apt-get install pdf2htmlex
      $ sudo apt-get -f install
      ```

    - Inside Docker

      If you are running into issues trying to run pdf2htmlEX due to library dependencies or other problems, you may try to run pdf2htmlEX as a docker container.  For this, uninstall any pdf2htmlEX installation you have on your system.

      Install Docker engine: https://docs.docker.com/installation/

      Then, create a new pdf2htmlEX executable under /usr/local/bin:

      ```
      $ sudo touch /usr/local/bin/pdf2htmlEX
      $ sudo chmod +x /usr/local/bin/pdf2htmlEX
      $ sudo vim /usr/local/bin/pdf2htmlEX
      ```

      Make this the content of the file:

      ```
      #!/bin/bash
      args="$@"
      args=${args/\/home/home}
      args=${args/\/tmp/tmp}
      docker run -t --rm -u $(id -u):$(id -g) -v /:/pdf bwits/pdf2htmlex pdf2htmlEX $args
      ```

      * NOTE: this is a very rudimentary script, any feedback on how to improve this would be greatly appreciated.

#Development

- **Dependencies**

  cd into uwazy folder and:

  `$ npm install` (on npm v2.x this can take a considerable time).

  Several globally accessible gems and npm modules are required:

  ```
  $ sudo gem install foreman
  $ sudo npm install -g webpack
  $ sudo npm install -g nodemon
  $ sudo npm install -g karma-cli
  ```

- **Fixtures**

  `$ git clone https://github.com/huridocs/uwazi-fixtures.git`

  cd into uwazy-fixtures and:

  ```
  $ npm install
  $ ./restore.sh
  ```

- **Create CouchDB views**
  cd into uwazy/couchdb and:

  `$ ./restore_views.sh`

- launch application: `foreman start`, the app will be available after few seconds on localhost:3000
- test api: `node test_api.js`
- test react: `karma start`

#Suggestions

- **IDE**

  -Ubuntu

    - SublimeText 3:

      In order to install the ES6 linter, you need to add to the package control the packages:
      - SublimeLinter
      - SublimeLinter-eslint
      In theory, it will use the eslint from the local node_modules, and the configuration from the .eslintrc
      In order to do JSX fromatting:
      - Babel
      Then open a .js file and go to:
      view -> syntax -> open all current extensions as ... -> Babel -> Javascript (Babel)

- If autowatch does not work, check the max_user_watches with:

  ```
  $ sysctl fs.inotify.max_user_watches
  ```

  If the number is relatively low (bellow 200K) try increasing the watchers by default with:

  ```
  $ echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
  ```

- If the nice 'World Globe' on the 'server listening on port...' line is not showing properly:


  ```
  $ sudo apt-get install ttf-ancient-fonts
  ```

=)
