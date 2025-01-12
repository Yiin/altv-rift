FROM node:20.11.0-bookworm-slim AS base

USER root

RUN apt-get update -y
RUN apt-get install -y libatomic1 curl libc-bin wget apt-transport-https ca-certificates gnupg
RUN apt autoremove -y
RUN apt-get clean

FROM base AS ready

USER root

RUN mkdir /altv
RUN echo '{"loadVoiceServer":true}' > /altv/.altvpkgrc.json

RUN npm install -g bun

ADD ./docker-scripts /root/setup
RUN cd /root/setup && npm i
RUN cd /root/setup && rm server.js package-lock.json

COPY ./voice-server/entrypoint.sh /root/
RUN chmod +x /root/entrypoint.sh

FROM ready AS downloaded

USER root
ARG BRANCH=release
ENV ALTV_BRANCH=$BRANCH 

WORKDIR /altv/

EXPOSE 7799/udp
EXPOSE 7799/tcp

ARG CACHEBUST=1

RUN cd /altv && bun --bun altv-pkg@latest ${BRANCH}
RUN rm -rf altv-server data modules libnode*
RUN chmod +x /altv/altv-voice-server
RUN chmod +x /altv/altv-crash-handler

ENTRYPOINT [ "/root/entrypoint.sh" ]
