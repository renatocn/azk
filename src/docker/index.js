import { config } from 'azk';
import { Docker, Image, Container } from 'azk/docker/docker';

var url = require('url');

module.exports = {
  __esModule: true,

  get default() {
    if (!this.connect) {
      var opts = url.parse(config('docker:host'));

      if (opts.protocol == 'unix:') {
        opts = { socketPath: opts.pathname };
      } else {
        var protocol = opts.protocol;
        opts = {
          protocol: protocol.substring(0, protocol.length - 1),
          host : 'http://' + opts.hostname,
          port : opts.port,
        };
      }
      this.connect = new Docker(opts);
    }
    return this.connect;
  },

  get Docker() { return Docker; },
  get Image() { return Image; },
  get Container() { return Container; },
};
