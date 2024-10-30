import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, FlatList } from 'react-native';
import { SafeAreaView } from '@components/containers';
import NavigationHeader from '@components/Header/NavigationHeader';
import { RoundedScrollContainer } from '@components/containers';
import { DetailField } from '@components/common/Detail';
import { formatDate } from '@utils/common/date';
import { showToastMessage } from '@components/Toast';
import { fetchPurchaseOrderDetails } from '@api/details/detailApi';
import PriceDetailList from './PriceDetailList';
import { OverlayLoader } from '@components/Loader';
import { Button } from '@components/common/Button';
import { COLORS } from '@constants/theme';
import { post, deleteRequest, put } from '@api/services/utils';
import { ConfirmationModal } from '@components/Modal';

const PurchaseOrderDetails = ({ navigation, route }) => {
    const { id: purchaseOrderId } = route?.params || {};
    const [details, setDetails] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [priceLines, setPriceLines] = useState(updatedPriceLines || []);
    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
    const [actionToPerform, setActionToPerform] = useState(null);

    const fetchDetails = async () => {
        setIsLoading(true);
        try {
            const updatedDetails = await fetchPurchaseOrderDetails(purchaseOrderId);
            const requestDetails = updatedDetails[0]?.request_details?.[0];
            setDetails(updatedDetails[0] || {});
            setPriceLines(requestDetails?.supplier_prices || []);
        } catch (error) {
            console.error('Error fetching purchase order details:', error);
            showToastMessage('Failed to fetch purchase order details. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (purchaseOrderId) {
                fetchDetails();
            }
        }, [purchaseOrderId])
    );

    // const handleVendorBill = async () => {
    //     try {
    //         const { _id } = details;
    //         const response = await post('/createPriceEnquiryPurchaseOrder', { _id });
    //         if (response.success === true || response.success === 'true') {
    //             showToastMessage('Purchase Order Created Successfully');
    //             navigation.navigate('OptionScreen');
    //         } else {
    //             showToastMessage('Failed to Create Purchase Order. Please try again.');
    //         }
    //     } catch (error) {
    //         showToastMessage('An error occurred. Please try again.');
    //     } finally {
    //         fetchDetails();
    //         setIsSubmitting(false);
    //     }
    // };

    // const handleDeletePrice = async () => {
    //     setIsSubmitting(true);
    //     try {
    //         const { _id } = details;
    //         const response = await deleteRequest(`//${_id}`);
    //         if (response.success === true || response.success === 'true') {
    //             showToastMessage('Price Enquiry Deleted Successfully');
    //             navigation.navigate('PriceEnquiryScreen');
    //         } else {
    //             showToastMessage('Failed to Delete Price Enquiry. Please try again.');
    //         }
    //     } catch (error) {
    //         showToastMessage('An error occurred. Please try again.');
    //     } finally {
    //         fetchDetails();
    //         setIsSubmitting(false);
    //     }
    // };

    // const handleEditPrice = () => {
    //     navigation.navigate('EditPriceEnquiryDetails', { id: purchaseOrderId });
    // };

    return (
        <SafeAreaView>
            <NavigationHeader
                title={details?.sequence_no || 'Purchase Order Details'}
                onBackPress={() => navigation.goBack()}
                logo={false}
            />
            <RoundedScrollContainer>
                <DetailField label="Sequence No" value={details?.request_details?.[0]?.requested_by?.employee_name || '-'} />
                <DetailField label="Supplier Name" value={formatDate(details?.request_details?.[0]?.request_date)} />
                <DetailField label="Ordered Date" value={details?.request_details?.[0]?.warehouse?.warehouse_name || '-'} />
                <DetailField label="Bill Date" value={formatDate(details?.request_details?.[0]?.require_by)} />
                <DetailField label="Purchase Type" value={formatDate(details?.request_details?.[0]?.require_by)} />
                <DetailField label="Company" value={formatDate(details?.request_details?.[0]?.require_by)} />
                <DetailField label="Country" value={formatDate(details?.request_details?.[0]?.require_by)} />
                <DetailField label="Currency" value={formatDate(details?.request_details?.[0]?.require_by)} />
                <DetailField label="TRN Number" value={formatDate(details?.request_details?.[0]?.require_by)} />
                <FlatList
                    data={priceLines}
                    renderItem={({ item }) => <PriceDetailList item={item} />}
                    keyExtractor={(item) => item._id}
                />

                <View style={{ flexDirection: 'row', marginVertical: 20 }}>
                    <Button
                        width={'30%'}
                        backgroundColor={COLORS.lightRed}
                        title="DELETE"
                        onPress={() => {
                            setActionToPerform('delete');
                            setIsConfirmationModalVisible(true);
                        }}
                    />
                    <View style={{ width: 5 }} />
                    <Button
                        width={'40%'}
                        backgroundColor={COLORS.tabIndicator}
                        title="Vendor Bills"
                        onPress={handleVendorBill}
                    />
                    <View style={{ width: 5 }} />
                    <Button
                        width={'30%'}
                        backgroundColor={COLORS.green}
                        title="EDIT"
                        onPress={handleEditPrice}
                    />
                </View>

                <ConfirmationModal
                    isVisible={isConfirmationModalVisible}
                    onCancel={() => setIsConfirmationModalVisible(false)}
                    headerMessage='Are you sure you want to Delete this?'
                    onConfirm={() => {
                        handleDeletePrice();
                        setIsConfirmationModalVisible(false);
                    }}
                />
                <OverlayLoader visible={isLoading || isSubmitting} />
            </RoundedScrollContainer>
        </SafeAreaView>
    );
};

export default PurchaseOrderDetails;