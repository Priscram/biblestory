@echo off
setlocal enabledelayedexpansion

echo Organizing recovered blobs into proper directory structure...

if not exist "organized_blobs" mkdir organized_blobs

for %%f in (recovered_blobs\*.txt) do (
    set "filename=%%~nf"
    set "filepath=recovered_blobs\%%f"

    echo Processing !filename!

    REM Read first line to determine file type
    set /p firstline=<"!filepath!"

    REM Check if it's a package.json (starts with {)
    echo !firstline! | findstr /C:"{" >nul
    if !errorlevel! == 0 (
        REM It's a JSON file, read the name field
        for /f "tokens=*" %%l in (!filepath!) do (
            echo %%l | findstr /C:"\"name\":" >nul
            if !errorlevel! == 0 (
                REM Extract the name value
                for /f "tokens=2 delims=:" %%n in ("%%l") do (
                    set "pkgname=%%n"
                    set "pkgname=!pkgname:"=!"
                    set "pkgname=!pkgname:,=!"
                    set "pkgname=!pkgname: =!"

                    REM Create directory structure
                    set "pkgdir=!pkgname:/=\!"
                    mkdir "organized_blobs\!pkgdir!" 2>nul

                    REM Copy file with proper extension
                    copy "!filepath!" "organized_blobs\!pkgdir!\package.json" >nul
                    echo   -> organized_blobs\!pkgdir!\package.json
                )
            )
        )
    ) else (
        REM Check if it's an SVG file
        echo !firstline! | findstr /C:"<svg" >nul
        if !errorlevel! == 0 (
            REM It's an SVG file
            mkdir "organized_blobs\flags" 2>nul
            copy "!filepath!" "organized_blobs\flags\!filename!.svg" >nul
            echo   -> organized_blobs\flags\!filename!.svg
        ) else (
            REM Check if it's a JavaScript export
            echo !firstline! | findstr /C:"exports =" >nul
            if !errorlevel! == 0 (
                mkdir "organized_blobs\js_exports" 2>nul
                copy "!filepath!" "organized_blobs\js_exports\!filename!.js" >nul
                echo   -> organized_blobs\js_exports\!filename!.js
            ) else (
                REM Unknown type, keep as txt
                mkdir "organized_blobs\unknown" 2>nul
                copy "!filepath!" "organized_blobs\unknown\!filename!.txt" >nul
                echo   -> organized_blobs\unknown\!filename!.txt
            )
        )
    )
)

echo.
echo Organization complete! Check the 'organized_blobs' directory.
echo.
echo Summary:
dir /s /b organized_blobs | find /c ".json"
echo JSON files found
dir /s /b organized_blobs | find /c ".svg"
echo SVG files found
dir /s /b organized_blobs | find /c ".js"
echo JS files found
dir /s /b organized_blobs | find /c ".txt"
echo Unknown files found