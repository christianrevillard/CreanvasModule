@echo ON

SET source=C:\Users\Christian\git
SET tools=C:\Users\Christian\Development\Tools

java ^
-jar %tools%\closure-compiler\compiler.jar ^
--js ^
	%source%\CreanvasNodeModule\Client\*.js ^
--js_output_file %source%\www\ClientFiles\common\js\CreanvasNodeClient.js ^
--define TEST=false ^
--define DEBUG=true ^
--formatting=pretty_print ^
--compilation_level WHITESPACE_ONLY

REM --compilation_level ADVANCED_OPTIMIZATIONS
REM --compilation_level SIMPLE_OPTIMIZATIONS

copy %source%\CreanvasNodeModule\Server\* %source%\www\node_modules\creanvas\

if not exist %source%\www\CreanvasNodeModule\Decorators mkdir %source%\www\node_modules\creanvas\Decorators
copy %source%\CreanvasNodeModule\Server\Decorators\* %source%\www\node_modules\creanvas\Decorators\

if not exist %source%\www\CreanvasNodeModule\CollisionSolver mkdir %source%\www\node_modules\creanvas\CollisionSolver
copy %source%\CreanvasNodeModule\Server\CollisionSolver\* %source%\www\node_modules\creanvas\CollisionSolver\

if not exist %source%\www\CreanvasNodeModule\ElementTypes mkdir %source%\www\node_modules\creanvas\ElementTypes
copy %source%\CreanvasNodeModule\Server\ElementTypes\* %source%\www\node_modules\creanvas\ElementTypes\
