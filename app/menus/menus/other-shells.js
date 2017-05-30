const {getConfig} = require('../../config');

module.exports = () => {
  const shells = getConfig().shells || {};
  const shellKeys = Object.keys(shells);

  const otherShellsMenu = {
    label: 'Other Shells',
    submenu: []
  };

  for (const shellName of shellKeys) {
    const shellOpts = shells[shellName];

    otherShellsMenu.submenu.push({
      label: shellName,
      submenu: [
        {
          label: 'New Window',
          click() {
            createWindow(null, {shellOpts});
          }
        },
        {
          label: 'New Tab',
          click(item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.rpc.emit('termgroup add req', {shellOpts});
            } else {
              createWindow(null, {shellOpts});
            }
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Split Vertically',
          click(item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.rpc.emit('split request vertical', {shellOpts});
            }
          }
        },
        {
          label: 'Split Horizontally',
          click(item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.rpc.emit('split request horizontal', {shellOpts});
            }
          }
        }
      ]
    });
  }

  return otherShellsMenu;
};