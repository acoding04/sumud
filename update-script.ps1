$replaceRules = @{
    'Your Next Store' = 'Sumud Scents'
    'Next Store' = 'Sumud Scents'
    'YnsLink' = 'AppLink'
    'YnsMedia' = 'AppMedia'
    'yns-link' = 'app-link'
    'yns-media' = 'app-media'
}

$files = Get-ChildItem -Path . -Recurse -Include *.tsx,*.ts,*.css,*.md,*.json -Exclude node_modules,.next,.git

foreach ($file in $files) {
    if ($file.FullName -match 'node_modules|\.git|\.next|AGENTS\.md') { continue }
    
    $content = [System.IO.File]::ReadAllText($file.FullName)
    $original = $content
    
    foreach ($key in $replaceRules.Keys) {
        $content = $content.Replace($key, $replaceRules[$key])
    }
    
    if ($content -cne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $content)
        Write-Host "Updated $($file.FullName)"
    }
}
