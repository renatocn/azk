import { _, Q, log, t } from 'azk';
import { Cli } from 'azk/cli/cli';
import { UI } from 'azk/cli/ui';
import { InvalidValueError } from 'azk/utils/errors';

var path = require('path');
var cmds_path = path.join(__dirname, "..", "cmds");

class CmdCli extends Cli {
  invalidCmd(error) {
    this.fail("commands.not_found", error.value);
    this.showUsage();
    return Q(1);
  }

  action(opts, parent_opts) {
    if (opts.help || _.isEmpty(opts.__leftover)) {
      this.showUsage();
      return Q(0);
    }

    // Set log level
    if (opts.log) {
      log.setConsoleLevel(opts.log);
    }

    return super(opts, parent_opts);
  }
}

export function cli(args, cwd, ui = UI) {
  var azk_cli = new CmdCli('azk', ui, cmds_path);
  azk_cli.addOption(['--log', '-l'] , { type: String });
  azk_cli.addOption(['--help', '-h']);

  azk_cli.cwd = cwd;
  try {
    var result = azk_cli.run(_.rest(args, 2));
  } catch (e) {
    var result = (e instanceof InvalidValueError && e.option == "command") ?
      azk_cli.invalidCmd(e) : Q.reject(e);
  }

  if (Q.isPromise(result)) {
    result.then((code) => {
      ui.exit(code ? code : 0);
    }, (error) => {
      console.log(error.stack ? error.stack : error);
      ui.exit(127);
    });
  }
}