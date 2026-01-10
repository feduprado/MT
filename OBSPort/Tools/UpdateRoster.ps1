$ErrorActionPreference = "Stop"



$RootPath = Split-Path -Parent $PSScriptRoot


$dataDir = Join-Path $RootPath "Data"
$uiDir   = Join-Path $RootPath "UI"


if (-not (Test-Path $dataDir)) { New-Item -ItemType Directory -Force -Path $dataDir | Out-Null }
if (-not (Test-Path $uiDir))   { New-Item -ItemType Directory -Force -Path $uiDir | Out-Null }

$rosterJsonPath = Join-Path $dataDir "roster.json"
$rosterJsPath   = Join-Path $uiDir "roster.data.js"
$teamsJsonPath  = Join-Path $dataDir "teams.json"
$teamsJsPath    = Join-Path $uiDir "teams.data.js"
$logPath        = Join-Path $dataDir "roster_generation.log"

$utf8NoBom = New-Object System.Text.UTF8Encoding $false

function Log-Msg {
    param([string]$Msg)
    $line = "[$(Get-Date -Format 'HH:mm:ss')] $Msg"
    Write-Host $line
    try { Add-Content -Path $logPath -Value $line -Encoding UTF8 } catch {}
}


try { Remove-Item $logPath -ErrorAction SilentlyContinue } catch {}
$projectName = Split-Path -Leaf $RootPath
Log-Msg "Raiz do projeto: . ($projectName)"


function Get-Relative-Path {
    param([string]$FullPath)
    
    
    $escapedRoot = [regex]::Escape($RootPath)
    $rel = $FullPath -replace "^$escapedRoot", ""
    
    return $rel.TrimStart("\").TrimStart("/").Replace("\", "/")
}


function Find-Active-Dir {
    param([string[]]$Candidates, [string]$Label)
    
    $bestDir = $null
    $maxCount = 0

    foreach ($relPath in $Candidates) {
        $fullPath = Join-Path $RootPath $relPath
        if (Test-Path $fullPath) {
            $count = (Get-ChildItem -Path $fullPath -Recurse -Include *.png, *.jpg, *.webp -File).Count
            Log-Msg "Verificando '$relPath': $count imagens."
            if ($count -gt $maxCount) {
                $maxCount = $count
                $bestDir = $fullPath
            }
        }
    }

    if (-not $bestDir) {
        Log-Msg "AVISO: Nenhuma imagem encontrada para $Label"
        return $null
    }
    
    $relBest = Get-Relative-Path -FullPath $bestDir
    Log-Msg ("USANDO " + $Label + ": " + $relBest + " (" + $maxCount + " arquivos)")
    return $bestDir
}


$playersDir = Find-Active-Dir -Candidates @("Assets/Players", "Players") -Label "JOGADORES"
$reservesDir = Find-Active-Dir -Candidates @("Assets/Reservas", "Reservas") -Label "RESERVAS"
$teamsDir = Find-Active-Dir -Candidates @("Assets/Times", "Times") -Label "TIMES"


$posLabels = @{ GOL="Goleiro"; ZAG="Zagueiro"; LAT="Lateral"; VOL="Volante"; MEI="Meia"; ATA="Atacante" }

function Parse-Filename {
    param([string]$BaseName)
    $clean = $BaseName -replace '_res$', ''
    if ($clean -match '^(\d{1,2})\s*-\s*(.+)\s*-\s*([A-Za-z]{2,4})$') {
        $pos = $matches[3].ToUpper()
        return @{ name = $matches[2].Trim(); number = [int]$matches[1]; pos = $pos; label = $posLabels[$pos] }
    }
    return @{ name = $clean.Trim(); number = $null; pos = $null; label = $null }
}

function Build-SearchKey {
    param($Name, $Num, $Pos, $Label, $Type)
    $raw = "$Num $Name $Pos $Label $Type".ToLower()
    
    $raw = $raw -replace '[áàãâä]', 'a' -replace '[éèêë]', 'e' -replace '[íìîï]', 'i' -replace '[óòõôö]', 'o' -replace '[úùûü]', 'u' -replace 'ç', 'c'
    return $raw.Trim()
}

function Get-Entries {
    param($Dir, $IsRes)
    if (-not $Dir) { return @() }
    
    $files = Get-ChildItem -Path $Dir -Recurse -Include *.png, *.jpg, *.webp -File | Sort-Object Name
    $results = @()

    foreach ($f in $files) {
        $bn = [System.IO.Path]::GetFileNameWithoutExtension($f.Name)
        $info = Parse-Filename -BaseName $bn
        
        $finalName = if ($info.name) { $info.name } else { $bn }
        $typeStr = if ($IsRes) { "reserva" } else { "titular" }
        $relPath = Get-Relative-Path -FullPath $f.FullName
        $sKey = Build-SearchKey $finalName $info.number $info.pos $info.label $typeStr

        $results += [ordered]@{
            name = $finalName
            number = $info.number
            pos = $info.pos
            posLabel = $info.label
            isReserve = $IsRes
            file = $relPath
            searchKey = $sKey
        }
    }
    return $results
}


$players = Get-Entries -Dir $playersDir -IsRes $false
$reserves = Get-Entries -Dir $reservesDir -IsRes $true

$rosterData = [ordered]@{
    generatedAt = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
    players = $players
    reserves = $reserves
}
$jsonRoster = $rosterData | ConvertTo-Json -Depth 4
[System.IO.File]::WriteAllText($rosterJsonPath, $jsonRoster, $utf8NoBom)
[System.IO.File]::WriteAllText($rosterJsPath, "window.SALVEDREW_ROSTER = $jsonRoster;", $utf8NoBom)
Log-Msg "Roster salvo."


function Get-Teams {
    param($Dir)
    if (-not $Dir) { return @() }
    
    $files = Get-ChildItem -Path $Dir -Recurse -Include *.png, *.jpg, *.webp -File | Sort-Object Name
    $results = @()

    foreach ($f in $files) {
        $bn = [System.IO.Path]::GetFileNameWithoutExtension($f.Name)
        $name = $bn
        $sigla = "---"
        if ($bn -match '(.+)_([A-Za-z0-9]{3})$') {
            $name = $matches[1]
            $sigla = $matches[2]
        }
        $relPath = Get-Relative-Path -FullPath $f.FullName
        $results += [ordered]@{ name = $name; file = $relPath; sigla = $sigla }
    }
    return $results
}
$teams = Get-Teams -Dir $teamsDir
$teamsData = [ordered]@{ generatedAt = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss"); teams = $teams }
$jsonTeams = $teamsData | ConvertTo-Json -Depth 4
[System.IO.File]::WriteAllText($teamsJsonPath, $jsonTeams, $utf8NoBom)
[System.IO.File]::WriteAllText($teamsJsPath, "window.SALVEDREW_TEAMS = $jsonTeams;", $utf8NoBom)
Log-Msg "Times salvos."
Log-Msg "SUCESSO."
