Set-Location 'C:\Users\Tex\Projects\09-dev-boilerplates'
Remove-Item *.zip -ErrorAction SilentlyContinue

$temp = 'C:\Users\Tex\AppData\Local\Temp\boilerplate-zips'
Remove-Item $temp -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $temp -Force | Out-Null

# Chrome Extension (clean copy)
robocopy 'chrome-extension-mv3' (Join-Path $temp 'chrome-extension-mv3') /E /XD node_modules dist .git | Out-Null
Compress-Archive -Path (Join-Path $temp 'chrome-extension-mv3') -DestinationPath 'chrome-extension-mv3-boilerplate.zip' -Force
Write-Host 'Chrome ZIP done'

# WP Plugin (clean copy)
robocopy 'wp-plugin-react-admin' (Join-Path $temp 'wp-plugin-react-admin') /E /XD node_modules build .git | Out-Null
Compress-Archive -Path (Join-Path $temp 'wp-plugin-react-admin') -DestinationPath 'wp-plugin-react-admin-boilerplate.zip' -Force
Write-Host 'WP ZIP done'

# Bundle
Copy-Item 'README.md' $temp
Compress-Archive -Path (Join-Path $temp '*') -DestinationPath 'dev-boilerplates-bundle.zip' -Force
Write-Host 'Bundle ZIP done'

Remove-Item $temp -Recurse -Force

# List results
$zips = Get-ChildItem *.zip
foreach ($z in $zips) {
    $sizekb = [math]::Round($z.Length / 1KB, 1)
    Write-Host ($z.Name + ' - ' + $sizekb + ' KB')
}
