# Install xvfb, so we can simulate a monitor and speakers for head-full chrome.
DEBIAN_FRONTEND=noninteractive apt-get update
DEBIAN_FRONTEND=noninteractive apt-get install -y wget gnupg unzip ca-certificates --no-install-recommends
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | DEBIAN_FRONTEND=noninteractive apt-key add -
sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
DEBIAN_FRONTEND=noninteractive apt-get update
DEBIAN_FRONTEND=noninteractive apt-get purge --auto-remove -y wget unzip
DEBIAN_FRONTEND=noninteractive apt-get install -y procps git google-chrome-stable libxss1 fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont --no-install-recommends
DEBIAN_FRONTEND=noninteractive apt-get install -y xvfb
rm -rf /var/lib/apt/lists/*
rm -rf /src/*.deb


# Add user so we don't need --no-sandbox.
groupadd -r myuser && useradd -r -g myuser -G audio,video myuser
mkdir -p /home/myuser/Downloads
chown -R myuser:myuser /home/myuser
chown -R myuser:myuser /app

# Self-destruct the installation script.
rm install.sh