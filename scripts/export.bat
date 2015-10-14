xcopy "%1..\..\Modules\CreanvasNodeModule\Client" "%1Lib\Client\js" /Y /I /S
xcopy "%1..\..\Modules\CreanvasNodeModule\Server" "%1node_modules\creanvas\Server" /Y /I /S
echo F | xcopy "%1..\..\Modules\CreanvasNodeModule\creanvas.js" "%1node_modules\creanvas\creanvas.js" /Y /I /S
echo F | xcopy "%1..\..\Modules\CreanvasNodeModule\package.json" "%1node_modules\creanvas\package.json" /Y /I /S
echo F | xcopy "%1..\..\Modules\CreanvasNodeModule\README.MD" "%1node_modules\creanvas\README.MD" /Y /I /S