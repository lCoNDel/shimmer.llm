Stop-Process -Name ngrok -Force -ErrorAction SilentlyContinue
Start-Process -FilePath "C:\Users\luisc\Documents\NGROK\ngrok.exe" -ArgumentList "http 5050" -WindowStyle Normal
