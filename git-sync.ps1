# Git Synchronization Helper for Google Antigravity
# Usage: .\git-sync.ps1 "Your commit message"

param (
    [string]$CommitMessage = "Update project contents and styles"
)

$git = "C:\Program Files\Git\cmd\git.exe"
$repoDir = $PSScriptRoot

# Ensure Git runs in the workspace directory
Set-Location $repoDir

Write-Host "--- Git Real-Time Sync Process ---"

try {
    # 1. Check if git repository is initialized
    if (-not (Test-Path (Join-Path $repoDir ".git"))) {
        Write-Host "Warning: Local git repository is not initialized. Initializing..."
        & $git init
        & $git remote add origin "https://github.com/aijazmajeed804/new-home-inserts.git"
    }

    # 2. Check for changes
    $status = & $git status --porcelain
    if ([string]::IsNullOrEmpty($status)) {
        Write-Host "No changes detected. Workspace is fully synchronized."
        return
    }

    Write-Host "Detected uncommitted changes:"
    Write-Host $status

    # 3. Stage changes
    Write-Host "Staging changes..."
    & $git add .

    # 4. Commit changes
    Write-Host "Creating Git commit..."
    & $git commit -m $CommitMessage

    # 5. Push to GitHub
    Write-Host "Pushing to GitHub main branch..."
    & $git push origin main
    
    Write-Host "Real-time sync complete! Successfully pushed to GitHub."
} catch {
    Write-Host "Git Sync Error: $_"
}
