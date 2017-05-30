const {getConfig} = require('../config');

// menus
const viewMenu = require('./menus/view');
const shellMenu = require('./menus/shell');
const editMenu = require('./menus/edit');
const pluginsMenu = require('./menus/plugins');
const windowMenu = require('./menus/window');
const helpMenu = require('./menus/help');
const darwinMenu = require('./menus/darwin');

module.exports = (createWindow, updatePlugins) => {
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

  const menu = [].concat(
    shellMenu(createWindow),
    otherShellsMenu,
    editMenu(),
    viewMenu(),
    pluginsMenu(updatePlugins),
    windowMenu(),
    helpMenu()
  );

  if (process.platform === 'darwin') {
    menu.unshift(
      darwinMenu()
    );
  }

  return menu;
};
