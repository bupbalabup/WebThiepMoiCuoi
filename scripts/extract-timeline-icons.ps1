param([Parameter(Mandatory=$true)][string]$Source)
Add-Type -AssemblyName System.Drawing
$sourceImage = [System.Drawing.Bitmap]::FromFile($Source)
$destination = Join-Path $PSScriptRoot '../public/images/timeline'
New-Item -ItemType Directory -Force -Path $destination | Out-Null
# Exact crops of the 859 x 710 reference, preserving the original linework.
$crops = @(
  @{name='welcome';x=117;y=184;w=119;h=139},
  @{name='rings';x=113;y=342;w=125;h=111},
  @{name='banquet';x=116;y=485;w=119;h=112},
  @{name='heart';x=401;y=632;w=46;h=42}
)
try {
  foreach ($crop in $crops) {
    $output = New-Object System.Drawing.Bitmap($crop.w,$crop.h)
    try {
      for ($y=0;$y -lt $crop.h;$y++) {
        for ($x=0;$x -lt $crop.w;$x++) {
          $pixel=$sourceImage.GetPixel($crop.x+$x,$crop.y+$y)
          $alpha=[Math]::Max(0,[Math]::Min(255,[Math]::Round((239-$pixel.B)/204.0*255)))
          if ($alpha -lt 8) { $alpha=0 }
          $output.SetPixel($x,$y,[System.Drawing.Color]::FromArgb($alpha,176,95,123))
        }
      }
      $output.Save((Join-Path $destination ($crop.name+'.png')),[System.Drawing.Imaging.ImageFormat]::Png)
    } finally { $output.Dispose() }
  }
} finally { $sourceImage.Dispose() }
