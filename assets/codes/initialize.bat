call cd ..
call mkdir externals
call cd externals
call git clone https://github.com/emscripten-core/emsdk.git
call cd emsdk
call git pull
call ./emsdk.bat install latest
call ./emsdk.bat activate latest --permanent
