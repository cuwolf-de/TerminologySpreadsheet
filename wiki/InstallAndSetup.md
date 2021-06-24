This is a very short step by step tutorial that explains how to setup and install the TerminologySpreadsheet as Webserver with Apache2 on Ubuntu(-Server).

This is not the only or best way, but a very simle and staight forward way. So if you have more knowledge about linux feel free to slightly vary your steps from this tutorial.

# Pre-Requirements
## 1. Server running Ubuntu (Linux)
Install a linux distribution (here Ubuntu-Server 18 or later) on a remote machine that is running 24/7 and is connected to the internet.

Log in to your remote machine via ssh with a user that is in the `sudo`-Group, so you have administrative rights to
- change apache2-Configuration files under `/etc/apache2`
- create a directory in `/var/www` for the webserver files
- install the `Apache2`-Webserver-Software via `apt`

## 2. Clone Webserver Files from GitHub
On your remote machine navigate to the folder where you want to place the root directory of your webserver with all the files in it.
Best practise would be to make a webserver folder in `/var/www` :
```
cd /var/www
sudo mkdir TerminologySpreadsheet
chown USERNAME:USERNAME TerminologySpreadsheet
```
Note that `USERNAME` should be replaced by your current username, so you are the owner of the folder `TerminologySpreadsheet` .

Now clone the webserver files into that directory
```
git clone https://github.com/cuwolf-de/TerminologySpreadsheet.git
```
The Repository has a `git-submodule` with a Reference to the [Bootstrap-Icons](https://github.com/twbs/icons) that are used in this project. To also download them as files you need to clone the submodule, too:
```
git submodule update --init --recursive
```

## 3. Configure Apache2-Webserver
### 3.1 Install Apache2-Webserver (if not already done)
Install Apache2 on Ubuntu via
```
apt install apache2
```
### 3.2 Configuration
Copy the apache2-Configuration File for the webpage from the current repository

`/var/www/TerminologySpreadsheet/apache2_config_templates/`

to

`/etc/apache2/sites-available/`  .

Now enable the webpage via
```
sudo a2ensite TODO:_NAME_OF_FILE
```
and restart apache2-Webserver via
```
sudo service apache2 restart
```
If the server port 80 for HTTP (or 443 for HTTPS) is accessible you now should be able to visit your webpage.