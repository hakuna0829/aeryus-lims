import React from 'react';
import PropTypes from 'prop-types';
import ReceiptOfDocuments from './ReceiptOfDocuments';
import AuthorizationForReleaseOfHealthInformation from './AuthorizationForReleaseOfHealthInformation';
import HipaaNoticeOfPrivacyPractices from './HipaaNoticeOfPrivacyPractices';
import PatientRulesAndResponsibilites from './PatientRulesAndResponsibilites';
import PatientConsentForServices from './PatientConsentForServices';
import PatientApprovalToBeTested from './PatientApprovalToBeTested';

const DocumentDialog = props => {
  const { open, type, data, onClose } = props;

  return (
    <div>
      {type === 'ReceiptOfDocuments' &&
        <ReceiptOfDocuments
          open={open}
          data={data}
          onClose={onClose}
        />
      }
      {type === 'AuthorizationForReleaseOfHealthInformation' &&
        <AuthorizationForReleaseOfHealthInformation
          open={open}
          data={data}
          onClose={onClose}
        />
      }
      {type === 'HipaaNoticeOfPrivacyPractices' &&
        <HipaaNoticeOfPrivacyPractices
          open={open}
          data={data}
          onClose={onClose}
        />
      }
      {type === 'PatientRulesAndResponsibilites' &&
        <PatientRulesAndResponsibilites
          open={open}
          data={data}
          onClose={onClose}
        />
      }
      {type === 'PatientConsentForServices' &&
        <PatientConsentForServices
          open={open}
          data={data}
          onClose={onClose}
        />
      }
      {type === 'PatientApprovalToBeTested' &&
        <PatientApprovalToBeTested
          open={open}
          data={data}
          onClose={onClose}
        />
      }
    </div>
  )
};

DocumentDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  type: PropTypes.string,
  data: PropTypes.any.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DocumentDialog;