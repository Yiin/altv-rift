FROM node:20.11.0-bookworm-slim as base
USER root
COPY ./docker-scripts /root/setup
COPY ./server/entrypoint.sh /root/
RUN apt-get update -y                                                                                               && \
  chmod +x /root/entrypoint.sh                                                                                      && \
  apt-get install -y curl lsof libatomic1 libc-bin wget apt-transport-https ca-certificates gnupg procps stow rsync && \
  apt autoremove -y                                                                                                 && \
  apt-get clean                                                                                                     && \
  rm -rf /var/lib/apt/lists/*
WORKDIR /root/setup
RUN npm i -g bun && bun install && bun add -g altv-pkg@latest

FROM base as downloaded
USER root
ARG BRANCH=rc
ENV ALTV_BRANCH=$BRANCH
WORKDIR /altv
EXPOSE 7788/udp 7788/tcp 7799/udp 5000/tcp 3000/tcp
