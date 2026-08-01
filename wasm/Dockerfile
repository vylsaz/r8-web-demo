FROM emscripten/emsdk:6.0.5

WORKDIR /opt
RUN git clone https://github.com/tsoding/r8.git
WORKDIR /opt/r8
ADD https://github.com/raysan5/raylib/releases/download/6.0/raylib-6.0_webassembly.zip ./raylib.zip
RUN unzip raylib.zip && rm raylib.zip

RUN ./vasm6502_oldstyle/linux/vasm6502_oldstyle ./examples/checker.asm -Fbin -o checker.rom
RUN emcc -c ./src/fake6502.c -o ./fake6502.o
RUN emcc -o r8.js ./src/r8.c ./fake6502.o ./raylib-6.0_webassembly/lib/libraylib.web.a \
    -Os -Wall \
    -I. -I ./raylib-6.0_webassembly/include \
    -s USE_GLFW=3 \
    -s ASYNCIFY \
    -s MODULARIZE \
    -s EXPORT_ES6 \
    --embed-file ./checker.rom \
    # -s EXPORTED_RUNTIME_METHODS=run \
    # -s TOTAL_STACK=64MB \
    # -s INITIAL_MEMORY=128MB \
    -s ASSERTIONS \
    -DPLATFORM_WEB

CMD [ "cp", "r8.js", "r8.wasm", "/out" ]
