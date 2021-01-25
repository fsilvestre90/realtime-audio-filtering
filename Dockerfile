FROM ubuntu

RUN apt-get update && \
    apt-get install -y curl build-essential python3 gcc

RUN curl -L https://sh.rustup.rs | sh -s -- -y --default-toolchain=nightly
ENV PATH=$PATH:~/.cargo/bin

RUN ~/.cargo/bin/rustup update
RUN ~/.cargo/bin/rustup target add wasm32-unknown-unknown --toolchain nightly
RUN ~/.cargo/bin/cargo install wasm-pack

WORKDIR /var/workspace

CMD python3 -m http.server 8081