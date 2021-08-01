
import React from 'react';

declare var Html5QrcodeScanner;

class Html5QrcodeScannerPlugin extends React.Component {
  componentDidMount() {
    // Creates the configuration object for Html5QrcodeScanner.
    function createConfig(props) {
      var config = {};
      if (props.fps) {
        config.fps = props.fps;
      }
      if (props.qrBox) {
        config.qrBox = props.qrBox;
      }
      if (props.aspectRatio) {
        config.aspectRatio = props.aspectRatio;
      }
      if (props.disableFlip !== undefined) {
        config.disableFlip = props.disableFlip;
      }
      return config;
    }

    var config = createConfig(this.props);
    var verbose = this.props.verbose === true;

    // Suceess callback is required.
    if (!(this.props.qrCodeSuccessCallback)) {
      // eslint-disable-next-line
      throw 'qrCodeSuccessCallback is required callback.';
    }

    this.html5QrcodeScanner = new Html5QrcodeScanner(
      'qr-code-full-region', config, verbose);
    this.html5QrcodeScanner.render(
      this.props.qrCodeSuccessCallback, this.props.qrCodeErrorCallback);
  }

  componentWillUnmount() {
    // TODO(mebjas): See if there is a better way to handle
    //  promise in `componentWillUnmount`.
    this.html5QrcodeScanner.clear().catch(error => {
      console.error('Failed to clear html5QrcodeScanner. ', error);
    });
  }

  render() {
    return <div id={'qr-code-full-region'} />;
  }
}

export default Html5QrcodeScannerPlugin;
