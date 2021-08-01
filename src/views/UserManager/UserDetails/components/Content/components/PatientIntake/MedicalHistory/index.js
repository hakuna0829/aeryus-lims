import React from 'react';
import MedicalHistoryPage1 from './MedicalHistoryPage1';
import MedicalHistoryPage2 from './MedicalHistoryPage2';

const MedicalHistory = () => {
    
    const [pageStep, setPageStep] = React.useState(1);

    
    return (
        <div >
            {
                pageStep === 1 ?
                    <MedicalHistoryPage1 nextFunc={setPageStep} />
                :
                    <MedicalHistoryPage2 />
            }
        </div>
    );
};

export default MedicalHistory;

