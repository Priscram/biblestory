@echo off
setlocal enabledelayedexpansion
echo Mapping blob hashes to filenames...

REM Create a mapping file
echo Hash -^> Filename mapping: > hash_to_filename.txt

REM Counter
set /a count=0
for /f %%i in ('type blob_hashes.txt ^| find /c /v ""') do set total=%%i

for /f %%h in (blob_hashes.txt) do (
    set /a count+=1

    REM Show progress every 50 hashes
    set /a mod=count %% 50
    if !mod! equ 0 (
        echo Processed !count!/!total! hashes...
    )

    REM Find the filename for this hash from Git history
    REM Get the most recent commit that contains this blob
    set "found="
    for /f "tokens=4" %%f in ('git rev-list --all ^| git ls-tree -r --name-only ^| findstr /c:"%%h" ^| head -1 2^>nul') do (
        echo %%h -^> %%f >> hash_to_filename.txt
        echo Mapped: %%h -^> %%f
        set "found=1"
    )

    if not defined found (
        echo %%h -^> NOT_FOUND >> hash_to_filename.txt
        echo No filename found for: %%h
    )
)

echo Mapping complete! Results saved to hash_to_filename.txt
echo Total processed: !count! hashes