import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { FlatList } from 'react-native';
import NavigationHeader from '@components/Header/NavigationHeader';
import { RoundedScrollContainer, SafeAreaView } from '@components/containers';
import { DetailField } from '@components/common/Detail';
import { formatDate } from '@utils/common/date';
import { showToastMessage } from '@components/Toast';
import { fetchDeliveryNoteDetails } from '@api/details/detailApi';
import { OverlayLoader } from '@components/Loader';
import { Button } from '@components/common/Button';
import { COLORS } from '@constants/theme';
import DeliveryNoteDetailList from './DeliveryNoteDetailList';

const DeliveryNoteDetails = ({ navigation, route }) => {
    const { id: deliveryNoteId } = route?.params || {};
    const [details, setDetails] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deliveryNotes, setDeliveryNotes] = useState([]);

    const fetchDetails = async () => {
        setIsLoading(true);
        try {
            const updatedDetails = await fetchDeliveryNoteDetails(deliveryNoteId);
            if (updatedDetails && updatedDetails[0]) {
                setDetails(updatedDetails[0]);
                setDeliveryNotes(updatedDetails[0]?.products_lines || []);
            }
        } catch (error) {
            console.error('Error fetching purchase order details:', error);
            showToastMessage('Failed to fetch purchase order details. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (deliveryNoteId) {
                fetchDetails(deliveryNoteId);
            }
        }, [deliveryNoteId])
    );

    const hanldePdfDownload = () => {
        navigation.navigate('EditPriceEnquiryDetails', { id: deliveryNoteId });
    };

    return (
        <SafeAreaView>
            <NavigationHeader
                title={'Delivery Note Creation'}
                onBackPress={() => navigation.goBack()}
                logo={false}
            />
            <RoundedScrollContainer>
                <DetailField label="Supplier Name" value={details?.supplier?.supplier_name || '-'} />
                <DetailField label="LPO No" value={details?.LPO_no || '-'} />
                <DetailField label="Ordered Date" value={formatDate(details?.order_date)} />
                <DetailField label="Bill Date" value={formatDate(details?.bill_date)} />
                <DetailField label="Purchase Type" value={details?.purchase_type} />
                <DetailField label="Company" value={details?.company?.company_name} />
                <DetailField label="Country" value={details?.country?.country_name} />
                <DetailField label="Currency" value={details?.currency?.currency_name} />
                <DetailField label="TRN Number" value={details?.Trn_number} />
                <FlatList
                    data={deliveryNotes}
                    renderItem={({ item }) => <DeliveryNoteDetailList item={item} />}
                    keyExtractor={(item) => item._id}
                />

                <Button
                    width={'50%'}
                    backgroundColor={COLORS.tabIndicator}
                    title="Submit"
                    onPress={() => navigation.navigate('VendorBillScreen', { id: details._id })}
                />

                <OverlayLoader visible={isLoading || isSubmitting} />
            </RoundedScrollContainer>
        </SafeAreaView>
    );
};

export default DeliveryNoteDetails;