$tools = @(
    @{ Name = "Bun";     CheckCmd = "bun";     Args = "-v";       InstallCmd = "powershell -c irm bun.sh/install.ps1 | iex" }
    @{ Name = "Node.js"; CheckCmd = "node";    Args = "--version"; InstallCmd = "winget install -e --id OpenJS.NodeJS" }
    @{ Name = "npm";     CheckCmd = "npm";     Args = "--version" } # npm comes with Node
)

foreach ($tool in $tools) {
    Write-Host "Checking for $($tool.Name)..." -ForegroundColor Cyan
    
    $resolvedCmd = Get-Command $tool.CheckCmd -ErrorAction SilentlyContinue

    if ($resolvedCmd) {
        $version = & $tool.CheckCmd $tool.Args
        Write-Host "✓ $($tool.Name) is installed (Version: $($version.Trim()))" -ForegroundColor Green
    } else {
        Write-Host "✗ $($tool.Name) is not installed." -ForegroundColor Yellow
        $choice = Read-Host "Would you like to download and install it? [Y/n]"
        
        if ($choice -match "^[Yy]$" -or $choice -eq "") {
            Write-Host "Installing $($tool.Name)..." -ForegroundColor Cyan
            Invoke-Expression $tool.InstallCmd
        } else {
            Write-Host "Skipping installation of $($tool.Name)." -ForegroundColor Gray
        }
    }
    Write-Host ""
}
