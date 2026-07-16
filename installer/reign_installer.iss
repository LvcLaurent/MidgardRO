; Installeur du client Reign of Midgard.
; Compile avec Inno Setup 6 (iscc.exe) - voir build-installer.ps1 pour l'invocation.
; Copie tout le contenu de client/ (jeu officiel + GRF custom + patcheur) sauf les
; fichiers d'anti-cheat inutilisés (GameGuard/HShield, désactivés par le patch NEMO)
; et les fichiers de cache/lock du patcheur (état local, ne doit pas être livré).

#define MyAppName "Reign of Midgard"
#define MyAppVersion "1.0"
#define MyAppExeName "reign_launcher.exe"
#define ClientDir "..\client"

[Setup]
AppId={{719E8F8F-3AB3-4E11-AD51-B2C2F839E115}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppName}
DisableProgramGroupPage=yes
OutputDir=output
OutputBaseFilename=ReignOfMidgard_Setup
SetupIconFile={#ClientDir}\ragnarok.ico
Compression=lzma2/ultra64
SolidCompression=yes
PrivilegesRequired=admin
WizardStyle=modern

[Languages]
Name: "french"; MessagesFile: "compiler:Languages\French.isl"

[Tasks]
Name: "desktopicon"; Description: "Créer un raccourci sur le Bureau"; GroupDescription: "Raccourcis additionnels :"

[Files]
Source: "{#ClientDir}\*"; DestDir: "{app}"; Flags: recursesubdirs ignoreversion; Excludes: "Supression\*,Supression,GameGuard.des,npkcrypt.dll,npkcrypt.sys,npkcrypt.vxd,npkcusb.sys,npkeysdk.dll,npkpdb.dll,NPCHK.DLL,NPCIPHER.DLL,NPPSK.DLL,NPSCAN.DES,NPUPDATE0.DLL,npupdate.dll,NPX.DLL,v3hunt.dll,reign_launcher.dat,reign_launcher.lock"

[Dirs]
; Autorise les lancements ultérieurs (non-admin) du patcheur à écrire/patcher les
; fichiers sans redemander l'élévation UAC à chaque mise à jour.
Name: "{app}"; Permissions: users-modify

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{group}\Désinstaller {#MyAppName}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "Lancer {#MyAppName}"; Flags: nowait postinstall skipifsilent
