import React from 'react';
import PropTypes from 'prop-types';
import GenerateTestPairingLabel from './GenerateTestPairingLabel';
import ScanTestPairingLabel from './ScanTestPairingLabel/ScanPairingLabel';
import PairedSuccess from './PairedSuccess';

const GeneratePairingLabel = (props) => {
  const { nextTab, previousTab, generateStep, user, testing, setTesting } = props;

  return (
    <div>
      {generateStep === 0 && (
        <GenerateTestPairingLabel
          nextTab={nextTab}
          testing={testing}
          setTesting={setTesting}
        />
      )}

      {generateStep === 1 && (
        <ScanTestPairingLabel
          nextTab={nextTab}
          previousTab={previousTab}
          testing={testing}
        />
      )}

      {generateStep === 2 && (
        <PairedSuccess
          nextTab={nextTab}
          previousTab={previousTab}
          testing={testing}
          user={user}
        />
      )}
    </div>
  );
};

GeneratePairingLabel.prototype = {
  nextTab: PropTypes.func.isRequired,
  testing: PropTypes.object.isRequired,
  setTesting: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

export default GeneratePairingLabel;
