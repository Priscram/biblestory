@echo off
echo Starting blob recovery process...
echo Creating recovery directory...

REM Create recovery directory
mkdir recovered_blobs 2>nul

echo Processing blob hashes...

REM Read each hash from the file and recover it
for /f %%i in (blob_hashes.txt) do (
    echo Recovering: %%i
    git show %%i > "recovered_blobs\%%i.txt" 2>nul
    if %errorlevel% equ 0 (
        echo Successfully recovered: %%i
    ) else (
        echo Failed to recover: %%i
    )
)

echo.
echo Recovery complete! Files saved in recovered_blobs\ directory.

REM Create a summary
echo Creating recovery summary...
dir /b recovered_blobs | find /c /v "" > recovered_blobs\summary.txt
echo Total recovered files: >> recovered_blobs\summary.txt
type recovered_blobs\summary.txt
echo Recovery summary saved to recovered_blobs\summary.txt