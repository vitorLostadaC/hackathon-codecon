Aqui está um exemplo básico de como implementar um atalho global para abrir uma nova janela:
javascriptconst { app, BrowserWindow, globalShortcut } = require('electron');
let mainWindow;

function createWindow() {
// Criar a janela do navegador
mainWindow = new BrowserWindow({
width: 800,
height: 600,
webPreferences: {
nodeIntegration: true,
contextIsolation: false
}
});

// Carregar a página inicial
mainWindow.loadFile('index.html');
}

// Quando o Electron terminar de inicializar
app.whenReady().then(() => {
createWindow();

// Registrar o atalho Ctrl+1
globalShortcut.register('CommandOrControl+1', () => {
// Criar uma nova janela quando o atalho for pressionado
let newWindow = new BrowserWindow({
width: 800,
height: 600,
webPreferences: {
nodeIntegration: true,
contextIsolation: false
}
});

    newWindow.loadFile('index.html');

});

app.on('activate', function () {
if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
});

// Desregistrar todos os atalhos ao fechar a aplicação
app.on('will-quit', () => {
globalShortcut.unregisterAll();
});

// Fechar a aplicação quando todas as janelas forem fechadas (no Windows/Linux)
app.on('window-all-closed', function () {
if (process.platform !== 'darwin') app.quit();
});
Pontos importantes para a implementação:

Use globalShortcut.register() para registrar o atalho.
O formato para teclas é 'CommandOrControl+1' (funciona tanto no Mac quanto no Windows/Linux).
É importante desregistrar os atalhos quando a aplicação for fechada usando globalShortcut.unregisterAll().
Os atalhos são globais, ou seja, funcionarão mesmo quando sua aplicação não estiver em foco.

Se você quiser registrar mais atalhos, pode adicionar mais chamadas ao globalShortcut.register():
javascript// Exemplo com mais atalhos
globalShortcut.register('CommandOrControl+2', () => {
// Abrir uma nova janela com outra página
let newWindow = new BrowserWindow({ width: 800, height: 600 });
newWindow.loadFile('page2.html');
});

globalShortcut.register('CommandOrControl+3', () => {
// Fazer algo diferente
console.log('Atalho Ctrl+3 pressionado');
});
