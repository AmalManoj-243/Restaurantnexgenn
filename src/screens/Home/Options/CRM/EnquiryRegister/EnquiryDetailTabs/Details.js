import React, { useState, useCallback } from 'react';
import { RoundedScrollContainer } from '@components/containers';
import { DetailField } from '@components/common/Detail';
import { useFocusEffect } from '@react-navigation/native';
import { showToastMessage } from '@components/Toast';

const Details = ({ enquiryId }) => {


  const [details, setDetails] = useState(initialDetails);

  const fetchDetails = async () => {
    try {
      const updatedDetails = await f(enquiryId);
      setDetails(updatedDetails[0]);
    } catch (error) {
      console.error('Error fetching visit details:', error);
      showToastMessage('Failed to fetch visit details');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDetails();
    }, [id])
  );

  return (
    <RoundedScrollContainer>
      <DetailField
        label="Date Time"
      
        
      />
      <DetailField
        label="Source"
      
      />
      <DetailField
        label="Name"
        placeholder="Enter Name"
       
      />
      <DetailField
        label="Company Name"
        placeholder="Enter Company Name"
       
      />
      <DetailField
        label="Phone"
        placeholder="Enter Phone Number"
       
      />
      <DetailField
        label="Email"
        placeholder="Enter Email"
       
      />
      <DetailField
        label="Address"
        placeholder="Enter Address"
      
      />
      <DetailField
        label="Enquiry Details"
        multiline={true}
        placeholder="Enter Enquiry Details"
      />
    </RoundedScrollContainer>
  );
};

export default Details;
