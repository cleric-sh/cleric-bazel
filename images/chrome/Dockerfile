FROM node:12-slim

# This image was inspired by https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-in-docker

# Install latest Chrome dev packages and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this also installs the necessary libs to make the bundled version of Chromium that Puppeteer installs, work.
RUN DEBIAN_FRONTEND=noninteractive apt-get update \
 && DEBIAN_FRONTEND=noninteractive apt-get install -y wget gnupg unzip ca-certificates --no-install-recommends \
 && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | DEBIAN_FRONTEND=noninteractive apt-key add - \
 && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
 && DEBIAN_FRONTEND=noninteractive apt-get update \
 && DEBIAN_FRONTEND=noninteractive apt-get purge --auto-remove -y wget unzip \
 && DEBIAN_FRONTEND=noninteractive apt-get install -y procps git google-chrome-stable libxss1 fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont \
    --no-install-recommends \
 && DEBIAN_FRONTEND=noninteractive apt-get install -y xvfb \
 && rm -rf /var/lib/apt/lists/* \
 && rm -rf /src/*.deb

# Sets path to Chrome executable, this is used by Apify.launchPuppeteer()
ENV CHROME_EXECUTABLE_PATH=/usr/bin/google-chrome

# Cd into /app
WORKDIR /home/myuser/app/

# Copy package.json into app folder
# COPY package.json yarn.lock /home/myuser/app/

# Install default dependencies, print versions of everything
# RUN yarn install \
#  && echo "Installed NPM packages:" \
#  && (yarn list || true) \
#  && echo "Node.js version:" \
#  && node --version \
#  && echo "Yarn version:" \
#  && yarn --version \
#  && echo "Google Chrome version:" \
#  && bash -c "$CHROME_EXECUTABLE_PATH --version"

# Tell Node.js this is a production environemnt
ENV NODE_ENV=production

# Build project
# COPY . /home/myuser/app/
# RUN yarn build

# Start server on port 3000
EXPOSE 3000:3000
ENV PORT=3000

# Enable Node.js process to use a lot of memory (actor has limit of 32GB)
# Increases default size of headers. The original limit was 80kb, but from node 10+ they decided to lower it to 8kb.
# However they did not think about all the sites there with large headers,
# so we put back the old limit of 80kb, which seems to work just fine.
ENV NODE_OPTIONS="--max_old_space_size=30000 --max-http-header-size=80000"

# Set up xvfb
ENV DISPLAY=:99
ENV XVFB_WHD=1280x720x16

# Add user so we don't need --no-sandbox.
RUN groupadd -r myuser && useradd -r -g myuser -G audio,video myuser \
    && mkdir -p /home/myuser/Downloads \
    && chown -R myuser:myuser /home/myuser

# Run everything after as non-privileged user.
USER myuser

# NOTEs:
# - This needs to be compatible with CLI.
# - Using CMD instead of ENTRYPOINT, to allow manual overriding
COPY ./scripts/start_xvfb_and_run_cmd.sh /home/myuser/app/scripts/start_xvfb_and_run_cmd.sh
CMD ./scripts/start_xvfb_and_run_cmd.sh && yarn start --silent
