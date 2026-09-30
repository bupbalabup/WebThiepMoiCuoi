Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = 'Stop'
$sourceDirectory = Join-Path $PSScriptRoot '../public/images/anhcuoi'
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
foreach ($file in Get-ChildItem -LiteralPath $sourceDirectory -Filter '*.JPG' | Where-Object { $_.Extension -ceq '.JPG' }) {
  $photo = [System.Drawing.Image]::FromFile($file.FullName)
  if ($photo.PropertyIdList -contains 274) {
    $orientation = [BitConverter]::ToUInt16($photo.GetPropertyItem(274).Value, 0)
    switch ($orientation) {
      2 { $photo.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipX) }
      3 { $photo.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipNone) }
      4 { $photo.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipX) }
      5 { $photo.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipX) }
      6 { $photo.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone) }
      7 { $photo.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipX) }
      8 { $photo.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone) }
    }
  }
  foreach ($edge in @(800, 1600)) {
    $scale = [Math]::Min(1.0, [double]$edge / [Math]::Max($photo.Width, $photo.Height))
    $bitmap = [System.Drawing.Bitmap]::new([int]($photo.Width * $scale), [int]($photo.Height * $scale))
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.DrawImage($photo, 0, 0, $bitmap.Width, $bitmap.Height)
    $parameters = New-Object System.Drawing.Imaging.EncoderParameters 1
    $parameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), ([long]82)
    $bitmap.Save((Join-Path $sourceDirectory ($file.BaseName + '-' + $edge + '.jpg')), $codec, $parameters)
    $parameters.Dispose(); $graphics.Dispose(); $bitmap.Dispose()
  }
  $photo.Dispose()
}
