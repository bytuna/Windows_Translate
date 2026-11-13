Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "C:\Users\HW\AndroidStudioProjects\Windows_Translate"
WshShell.Run "cmd /c npm start", 0, False