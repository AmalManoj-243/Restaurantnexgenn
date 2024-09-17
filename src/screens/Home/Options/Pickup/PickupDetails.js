import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from '@components/containers';
import NavigationHeader from '@components/Header/NavigationHeader';
import { RoundedScrollContainer } from '@components/containers';
import { DetailField } from '@components/common/Detail';
import { showToastMessage } from '@components/Toast';
import { fetchPickupDetails } from '@api/details/detailApi';
import { OverlayLoader } from '@components/Loader';

const PickupDetails = ({ navigation, route }) => {
    const { id: pickupId } = route?.params || {};
    const [details, setDetails] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const fetchDetails = async () => {
        setIsLoading(true);
        try {
            const updatedDetails = await fetchPickupDetails(pickupId);
            setDetails(updatedDetails[0] || {});
        } catch (error) {
            console.error('Error fetching Pickup details:', error);
            showToastMessage('Failed to fetch Pickup details. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
      
    useFocusEffect(
        useCallback(() => {
            if (pickupId) {
                fetchDetails(pickupId);
            }
        }, [pickupId])
    );

    return (
        <SafeAreaView>
        <NavigationHeader
            title={details?.sequence_no || 'Pickup Details'}
            onBackPress={() => navigation.goBack()}
            logo={false}
            iconOneName='edit'
            iconOnePress={() => navigation.navigate('EditPickup', { pickupId})}
        />
        <RoundedScrollContainer>
            <DetailField
                label="Customer Name"
                value={details?.customer_name ? details.customer_name.trim() : '-'}
                multiline
                numberOfLines={3}
                textAlignVertical={'top'}
            />
            <DetailField label="Brand Name" value={details?.brand_name || '-'} />
            <DetailField label="Device Name" value={details?.device_name || '-'} />
            <DetailField label="Consumer Model" value={details?.consumer_model_name || '-'} />
            <DetailField label="Sequence No" value={details?.sequence_no || '-'} />
            <DetailField label="Date" value={details?.date} />
            <DetailField label="SalesPerson Name" value={details?.salesperson_name || '-'} />
            <DetailField label="Warehouse" value={details?.warehouse_name || '-'} />
            <DetailField label="Contact Name" value={details?.contact_name || '-'} />
            <DetailField label="Contact No" value={details?.contact_no || '-'} />
            <DetailField label="Contact Email" value={details?.contact_email || '-'} />

            {/* <DetailField label="Check Box" value={details?.contact_email || '-'} /> */}

            <DetailField label="PickUp Schedule" value={details?.pickup_scheduled_time || '-'} />
            <DetailField label="Assignee Name" value={details?.assignee_name || '-'} />
            <DetailField label="Serial No" value={details?.serial_no || '-'} />
            <DetailField label="Customer Signature" value={details?.customer_signature || '-'} />
            <DetailField label="Driver Signature" value={details?.driver_signature || '-'} />
            <DetailField label="Coordinator Signature" value={details?.coordinator_signature || '-'} />
            <DetailField label="Remarks"
                value={details?.remarks || '-'}
                multiline
                numberOfLines={2}
                textAlignVertical={'top'}
            />
            <DetailField
                label="Customer Address"
                value={details?.pre_condition || '-'}
                multiline
                numberOfLines={2}
                textAlignVertical={'top'}
            />
            <OverlayLoader visible={isLoading} />
        </RoundedScrollContainer>
        </SafeAreaView>
    );
};

export default PickupDetails;
