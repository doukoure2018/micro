# ============================================================
# EXPORT DES 5 TABLES SQL VERS UN CLASSEUR XLSX (sans Excel COM)
# Windows PowerShell 5.1 / Excel 2021
# ============================================================
$ErrorActionPreference = 'Stop'

$Dossier = 'D:\Extraction_Credits'
$FichierListe = Join-Path $Dossier 'liste_credits.txt'
$Horodatage = Get-Date -Format 'yyyyMMdd_HHmmss'
$FichierExcel = Join-Path $Dossier ("Extraction_Credits_Multiple_{0}.xlsx" -f $Horodatage)
$ServeurSQL = '.'
$BaseSQL = 'BDCRG'
$UtilisateurSQL = 'sa'
$conn = $null

function ConvertTo-XmlSafe([string]$Texte) {
    if ($null -eq $Texte) { return '' }
    return [System.Security.SecurityElement]::Escape($Texte)
}

function ConvertTo-ColumnName([int]$Index) {
    $s = ''
    while ($Index -gt 0) {
        $Index--
        $s = [char](65 + ($Index % 26)) + $s
        $Index = [math]::Floor($Index / 26)
    }
    return $s
}

function Get-SqlTable {
    param([System.Data.SqlClient.SqlConnection]$Connection,[string]$Query,[string]$Nom)
    Write-Host "Extraction de $Nom..." -ForegroundColor Cyan
    $command = $Connection.CreateCommand()
    $command.CommandTimeout = 0
    $command.CommandText = $Query
    $adapter = New-Object System.Data.SqlClient.SqlDataAdapter($command)
    $table = New-Object System.Data.DataTable
    try { [void]$adapter.Fill($table) }
    finally { $adapter.Dispose(); $command.Dispose() }
    Write-Host ("{0} : {1} ligne(s) extraites" -f $Nom, $table.Rows.Count) -ForegroundColor Green
    return ,$table
}

function Write-XlsxSheet {
    param([System.IO.Compression.ZipArchive]$Zip,[string]$EntryName,[System.Data.DataTable]$Table)
    $entry = $Zip.CreateEntry($EntryName)
    $stream = $entry.Open()
    $writer = [System.IO.StreamWriter]::new($stream, [System.Text.UTF8Encoding]::new($false))
    try {
        $writer.Write('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>')
        $writer.Write('<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>')
        $rowNum = 1
        $writer.Write('<row r="1">')
        for ($c=0; $c -lt $Table.Columns.Count; $c++) {
            $ref = (ConvertTo-ColumnName ($c+1)) + '1'
            $name = ConvertTo-XmlSafe ([string]$Table.Columns[$c].ColumnName)
            $writer.Write("<c r=""$ref"" t=""inlineStr""><is><t xml:space=""preserve"">$name</t></is></c>")
        }
        $writer.Write('</row>')
        for ($r=0; $r -lt $Table.Rows.Count; $r++) {
            $rowNum = $r + 2
            $writer.Write("<row r=""$rowNum"">")
            for ($c=0; $c -lt $Table.Columns.Count; $c++) {
                $v = $Table.Rows[$r][$c]
                if ($null -eq $v -or $v -is [System.DBNull]) { continue }
                $colName = [string]$Table.Columns[$c].ColumnName
                $ref = (ConvertTo-ColumnName ($c+1)) + $rowNum

                # Credit/account identifiers are written as text to avoid precision loss.
                if ($colName -match '^(NUM_CREDITO|NUM_CUENTA)$') {
                    $txt = ConvertTo-XmlSafe ([System.Convert]::ToString($v,[Globalization.CultureInfo]::InvariantCulture))
                    $writer.Write("<c r=""$ref"" t=""inlineStr""><is><t xml:space=""preserve"">$txt</t></is></c>")
                }
                elseif ($v -is [datetime]) {
                    $oa = ([datetime]$v).ToOADate().ToString('0.##########',[Globalization.CultureInfo]::InvariantCulture)
                    $writer.Write("<c r=""$ref"" s=""1""><v>$oa</v></c>")
                }
                elseif ($v -is [bool]) {
                    $bv = if ($v) { '1' } else { '0' }
                    $writer.Write("<c r=""$ref"" t=""b""><v>$bv</v></c>")
                }
                elseif ($v -is [byte] -or $v -is [int16] -or $v -is [int32] -or $v -is [int64] -or $v -is [decimal] -or $v -is [double] -or $v -is [single]) {
                    $num = [System.Convert]::ToString($v,[Globalization.CultureInfo]::InvariantCulture)
                    $writer.Write("<c r=""$ref""><v>$num</v></c>")
                }
                else {
                    $txt = ConvertTo-XmlSafe ([System.Convert]::ToString($v,[Globalization.CultureInfo]::InvariantCulture))
                    $writer.Write("<c r=""$ref"" t=""inlineStr""><is><t xml:space=""preserve"">$txt</t></is></c>")
                }
            }
            $writer.Write('</row>')
        }
        $writer.Write('</sheetData></worksheet>')
    }
    finally { $writer.Dispose(); $stream.Dispose() }
}

function Add-XlsxTextEntry {
    param([System.IO.Compression.ZipArchive]$Zip,[string]$Name,[string]$Content)
    $entry = $Zip.CreateEntry($Name)
    $stream = $entry.Open()
    $writer = [System.IO.StreamWriter]::new($stream, [System.Text.UTF8Encoding]::new($false))
    try { $writer.Write($Content) } finally { $writer.Dispose(); $stream.Dispose() }
}

try {
    Write-Host "Lecture du fichier : $FichierListe" -ForegroundColor Cyan
    if (-not (Test-Path -LiteralPath $FichierListe)) { throw "Fichier introuvable : $FichierListe" }

    $creditStrings = @(
        Get-Content -LiteralPath $FichierListe | ForEach-Object {
            $ligne = ([string]$_).Trim()
            if ($ligne -match '^\d+$') { $ligne }
            elseif ($ligne -match '\d+') { $Matches[0] }
        } | Sort-Object -Unique
    )
    if ($creditStrings.Count -eq 0) { throw "Aucun numéro de crédit valide dans liste_credits.txt." }
    Write-Host "$($creditStrings.Count) numéro(s) de crédit distinct(s) détecté(s)." -ForegroundColor Cyan

    $securePassword = Read-Host "Entrez le mot de passe SQL du compte '$UtilisateurSQL' utilisé dans SSMS" -AsSecureString
    $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
    try { $motDePasse = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr) }
    finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }

    Write-Host "Connexion au serveur SQL $ServeurSQL / base $BaseSQL..." -ForegroundColor Cyan
    $builder = New-Object System.Data.SqlClient.SqlConnectionStringBuilder
    $builder['Data Source'] = $ServeurSQL
    $builder['Initial Catalog'] = $BaseSQL
    $builder['User ID'] = $UtilisateurSQL
    $builder['Password'] = $motDePasse
    $builder['Connect Timeout'] = 30
    $builder['Application Name'] = 'ExtractionCreditsMultiple'
    $builder['TrustServerCertificate'] = $true
    $conn = New-Object System.Data.SqlClient.SqlConnection($builder.ConnectionString)
    $conn.Open()
    Write-Host 'Connexion réussie.' -ForegroundColor Green

    $cmd = $conn.CreateCommand()
    $cmd.CommandTimeout = 0
    $cmd.CommandText = @'
CREATE TABLE #ListeCredits (NUM_CREDITO DECIMAL(18,0) NOT NULL PRIMARY KEY);
'@
    [void]$cmd.ExecuteNonQuery()
    $cmd.Dispose()

    foreach ($credit in $creditStrings) {
        $cmd = $conn.CreateCommand()
    $cmd.CommandTimeout = 0
        $cmd.CommandText = 'INSERT INTO #ListeCredits (NUM_CREDITO) VALUES (@credito);'
        $p = $cmd.Parameters.Add('@credito',[System.Data.SqlDbType]::Decimal)
        $p.Precision = 18; $p.Scale = 0
        $p.Value = [decimal]::Parse($credit,[Globalization.CultureInfo]::InvariantCulture)
        [void]$cmd.ExecuteNonQuery()
        $cmd.Dispose()
    }

    # Construire la liste des crédits retrouvés avec leurs clés de rattachement.
    $cmd = $conn.CreateCommand()
    $cmd.CommandTimeout = 0
    $cmd.CommandText = @'
SELECT DISTINCT
    C.COD_EMPRESA,
    C.COD_AGENCIA,
    C.NUM_CREDITO,
    C.COD_CLIENTE,
    C.ID_CUENTA
INTO #CreditsAExtraire
FROM PR.PR_CREDITOS AS C
INNER JOIN #ListeCredits AS L
    ON L.NUM_CREDITO = C.NUM_CREDITO;
'@
    [void]$cmd.ExecuteNonQuery()
    $cmd.Dispose()

    $qCredits = @"
SELECT C.*
FROM PR.PR_CREDITOS AS C
INNER JOIN #CreditsAExtraire AS L
    ON L.COD_EMPRESA = C.COD_EMPRESA
   AND L.COD_AGENCIA = C.COD_AGENCIA
   AND L.NUM_CREDITO = C.NUM_CREDITO
ORDER BY C.COD_EMPRESA, C.COD_AGENCIA, C.NUM_CREDITO;
"@
    $qPlan = @"
SELECT P.*
FROM PR.PR_PLAN_PAGOS AS P
INNER JOIN #CreditsAExtraire AS L
    ON L.COD_EMPRESA = P.COD_EMPRESA
   AND L.COD_AGENCIA = P.COD_AGENCIA
   AND L.NUM_CREDITO = P.NUM_CREDITO
ORDER BY P.COD_EMPRESA, P.COD_AGENCIA, P.NUM_CREDITO, P.NUM_CUOTA;
"@
    $qMouv = @"
SELECT M.*
FROM PR.PR_MOVIMIENTOS AS M
INNER JOIN #CreditsAExtraire AS L
    ON L.COD_EMPRESA = M.COD_EMPRESA
   AND L.COD_AGENCIA = M.COD_AGENCIA
   AND L.NUM_CREDITO = M.NUM_CREDITO
ORDER BY M.COD_EMPRESA, M.COD_AGENCIA, M.NUM_CREDITO, M.FEC_MOVIMIENTO, M.NUM_MOVIMIENTO;
"@
    $qCC = @"
 /*
   Alignement sur Power Query :
   - on conserve uniquement les mouvements dont DES_MOVIMIENTO contient
     le NUM_CREDITO de la liste ;
   - on ne filtre pas par COD_AGENCIA ni par NUM_CUENTA, car Power Query
     inclut aussi les mouvements trouvés dans une autre agence ou un autre compte ;
   - la colonne NUM_CREDITO est ajoutée explicitement au résultat.
   Cette règle n'extrait donc PAS tous les mouvements de ID_CUENTA :
   elle extrait uniquement ceux dont DES_MOVIMIENTO contient le crédit.
 */
SELECT DISTINCT
    L.NUM_CREDITO AS NUM_CREDITO,
    M.*
FROM CC.CC_MOVIMTO_MENSUAL AS M
INNER JOIN #CreditsAExtraire AS L
    ON CHARINDEX(
           CONVERT(VARCHAR(30), CONVERT(BIGINT, L.NUM_CREDITO)) COLLATE DATABASE_DEFAULT,
           ISNULL(CONVERT(VARCHAR(MAX), M.DES_MOVIMIENTO), '') COLLATE DATABASE_DEFAULT
       ) > 0
ORDER BY
    NUM_CREDITO, COD_EMPRESA, COD_AGENCIA, NUM_CUENTA,
    FEC_MOVIMIENTO, NUM_MOVIMIENTO;
"@
    $qCG = @"
SELECT DISTINCT
    L.NUM_CREDITO AS NUM_CREDITO,
    A.*
FROM CG.CG_ASTO_DETALLE AS A
INNER JOIN #CreditsAExtraire AS L
    ON L.COD_EMPRESA = A.COD_EMPRESA
   AND L.COD_AGENCIA = A.COD_AGENCIA
WHERE CHARINDEX(
          CONVERT(VARCHAR(30), CONVERT(BIGINT, L.NUM_CREDITO)) COLLATE DATABASE_DEFAULT,
          ISNULL(CONVERT(VARCHAR(MAX), A.REFERENCIA), '') COLLATE DATABASE_DEFAULT
      ) > 0
ORDER BY
    NUM_CREDITO, A.COD_EMPRESA, A.COD_AGENCIA,
    A.FEC_MOVIMIENTO, A.NUM_ASIENTO, A.NUM_LINEA;
"@

    $tables = @(
        (Get-SqlTable -Connection $conn -Query $qCredits -Nom 'PR_CREDITOS'),
        (Get-SqlTable -Connection $conn -Query $qPlan -Nom 'PR_PLAN_PAGOS'),
        (Get-SqlTable -Connection $conn -Query $qMouv -Nom 'PR_MOVIMIENTOS'),
        (Get-SqlTable -Connection $conn -Query $qCC -Nom 'CC_MOVIMTO_MENSUAL'),
        (Get-SqlTable -Connection $conn -Query $qCG -Nom 'CG_ASTO_DETALLE')
    )
    $conn.Close()

    Write-Host 'Création du classeur Excel (sans automatisation COM)...' -ForegroundColor Cyan
    Add-Type -AssemblyName System.IO.Compression
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    if (Test-Path -LiteralPath $FichierExcel) { Remove-Item -LiteralPath $FichierExcel -Force }

    $fileStream = [System.IO.File]::Open($FichierExcel,[System.IO.FileMode]::CreateNew)
    try {
        $zip = New-Object System.IO.Compression.ZipArchive($fileStream,[System.IO.Compression.ZipArchiveMode]::Create,$false)
        try {
            Add-XlsxTextEntry $zip '[Content_Types].xml' @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/worksheets/sheet3.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/worksheets/sheet4.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/worksheets/sheet5.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>
'@
            Add-XlsxTextEntry $zip '_rels/.rels' @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>
'@
            Add-XlsxTextEntry $zip 'xl/workbook.xml' @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets>
<sheet name="PR_CREDITOS" sheetId="1" r:id="rId1"/>
<sheet name="PR_PLAN_PAGOS" sheetId="2" r:id="rId2"/>
<sheet name="PR_MOVIMIENTOS" sheetId="3" r:id="rId3"/>
<sheet name="CC_MOVIMTO_MENSUAL" sheetId="4" r:id="rId4"/>
<sheet name="CG_ASTO_DETALLE" sheetId="5" r:id="rId5"/>
</sheets></workbook>
'@
            Add-XlsxTextEntry $zip 'xl/_rels/workbook.xml.rels' @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>
<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet3.xml"/>
<Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet4.xml"/>
<Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet5.xml"/>
<Relationship Id="rId6" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>
'@
            Add-XlsxTextEntry $zip 'xl/styles.xml' @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<numFmts count="1"><numFmt numFmtId="164" formatCode="dd/mm/yyyy hh:mm:ss"/></numFmts>
<fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts>
<fills count="1"><fill><patternFill patternType="none"/></fill></fills>
<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/></cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>
'@
            for ($i=0; $i -lt 5; $i++) {
                Write-XlsxSheet -Zip $zip -EntryName ("xl/worksheets/sheet{0}.xml" -f ($i+1)) -Table $tables[$i]
                Write-Host ("Feuille {0} préparée : {1} ligne(s)." -f @('PR_CREDITOS','PR_PLAN_PAGOS','PR_MOVIMIENTOS','CC_MOVIMTO_MENSUAL','CG_ASTO_DETALLE')[$i],$tables[$i].Rows.Count) -ForegroundColor Green
            }
        }
        finally { $zip.Dispose() }
    }
    finally { $fileStream.Dispose() }

    if (-not (Test-Path -LiteralPath $FichierExcel)) { throw "Le fichier Excel n'a pas été créé." }
    Write-Host 'EXPORT TERMINÉ AVEC SUCCÈS' -ForegroundColor Green
    Write-Host "Fichier : $FichierExcel" -ForegroundColor Green
    Write-Host "Aucune modification n'a été effectuée dans les tables métier SQL." -ForegroundColor Yellow
    Invoke-Item -LiteralPath $FichierExcel
}
catch {
    Write-Host ("ERREUR : {0}" -f $_.Exception.Message) -ForegroundColor Red
    if ($_.InvocationInfo -and $_.InvocationInfo.ScriptLineNumber) {
        Write-Host ("Ligne du script : {0}" -f $_.InvocationInfo.ScriptLineNumber) -ForegroundColor Red
    }
    Write-Host "Aucune modification n'a été effectuée dans les tables métier SQL." -ForegroundColor Yellow
}
finally {
    if ($conn -ne $null) {
        try { if ($conn.State -eq 'Open') { $conn.Close() }; $conn.Dispose() } catch {}
    }
}
