# Installation and Setup for Server-Admins
This is a very short step by step tutorial that explains how to setup and install the TerminologySpreadsheet as Webserver with Apache2 on Ubuntu(-Server).

This is not the only or best way, but a very simle and staight forward way. So if you have knowledge about linux feel free to vary your steps from this tutorial.

## 1. Server running Ubuntu (Linux)
Install a linux distribution (here Ubuntu-Server 18 or later) on a remote machine that is running 24/7 and is connected to the internet.

Log in to your remote machine via ssh with a user that is in the `sudo`-Group, so you have administrative rights to
- change apache2-Configuration files under `/etc/apache2`
- create a directory in `/var/www` to place the webserver files
- install the `Apache2`-Webserver-Software via `apt`

## 2. Clone Webserver Files from GitHub
On your remote machine navigate to the folder where you want to place the root directory of your webserver with all the files in it.
Best practise would be to make a webserver folder in `/var/www` :
```
cd /var/www
sudo mkdir TerminologySpreadsheet
chown USERNAME:USERNAME TerminologySpreadsheet
```
Note that `USERNAME` should be replaced by your current username, so you are the owner of the folder `TerminologySpreadsheet` and you can edit these files later on.

Now clone the webserver files into that directory
```
git clone https://github.com/cuwolf-de/TerminologySpreadsheet.git
```
The Repository has a `git-submodule` with a Reference to the [Bootstrap-Icons](https://github.com/twbs/icons) that are used in this project. To also download them as files you need to go into the Project Folder `TerminologySpreadsheet` and also download the submodule files via
```
cd TerminologySpreadsheet
git submodule update --init --recursive
```

## 3. Configure Apache2-Webserver
### 3.1 Install Apache2-Webserver (if not already done)
> NOTE:
>
> A more detailled Description about Apache2-Webserver can be found under:
> - Documentation for Apache2 on Ubuntu: [https://wiki.ubuntuusers.de/Apache_2.4/](https://wiki.ubuntuusers.de/Apache_2.4/)
> - Official Apache2 Documentation: [https://httpd.apache.org/docs/2.4/](https://httpd.apache.org/docs/2.4/)
> - More detailled tutorial: [https://www.digitalocean.com/community/tutorials/how-to-install-the-apache-web-server-on-ubuntu-20-04-de](https://www.digitalocean.com/community/tutorials/how-to-install-the-apache-web-server-on-ubuntu-20-04-de)

Install Apache2 on Ubuntu via
```
sudo apt install apache2
```
And make sure you enable the used apache2 Mods
```
sudo a2enmod rewrite
```
> NOTE:
>
> Maybe you want to get HTTPS with SSL-Encryption running instead of the unencrypted HTTP-Connection. Please search the information on your own how to configure SSL with SSL-Certificates (e.g. from Let's Encrypt) on your Apache2-Website. You will need to adapt the Webserver-Config-File `vserver-HTTP-terminologySpreadsheet.conf` in `/etc/apache2/sites-available` .
### 3.2 Configuration
Copy the apache2-Configuration File for the webpage from the current repository

`/var/www/TerminologySpreadsheet/apache2_config_templates/vserver-HTTP-terminologySpreadsheet.conf`

to

`/etc/apache2/sites-available/vserver-HTTP-terminologySpreadsheet.conf`  .

> NOTE:
> 
> Adaptions to `vserver-HTTP-terminologySpreadsheet.conf` :
>
> You have to change
> ```
> ServerName 127.0.0.1
> ```
> to the IP-Address of your server or a valid domain (with or without subdomain) that points to your server.
> 
> If you are running multiple virtual servers on the same `subdomain.domain` you might want to change the port from 80 to another one in the first line.

Now enable the webpage via
```
sudo a2ensite vserver-HTTP-terminologySpreadsheet.conf
```
and restart apache2-Webserver via
```
sudo service apache2 restart
```
If the server port 80 for HTTP (or 443 for HTTPS) is accessible you now should be able to visit your webpage by calling the domain or ip adress in your webbrowser (in current case e.g. `http://127.0.0.1` or `http://subdomain.domain.de`).