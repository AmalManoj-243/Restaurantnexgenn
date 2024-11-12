import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, FlatList, Text, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from '@components/containers';
import NavigationHeader from '@components/Header/NavigationHeader';
import { RoundedScrollContainer } from '@components/containers';
import { DetailField } from '@components/common/Detail';
import { formatDate } from '@utils/common/date';
import { showToastMessage } from '@components/Toast';
import { fetchPurchaseOrderDetails } from '@api/details/detailApi';
import PurchaseOrderDetailList from './PurchaseOrderDetailList';
import { OverlayLoader } from '@components/Loader';
import { Button } from '@components/common/Button';
import { COLORS } from '@constants/theme';
import { post, deleteRequest } from '@api/services/utils';
import { ConfirmationModal, MenuModal } from '@components/Modal';

const PurchaseOrderDetails = ({ navigation, route }) => {
    const { id: purchaseOrderId } = route?.params || {};
    const [details, setDetails] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [purchaseOrderLines, setPurchaseOrderLines] = useState([]);
    const [isMenuModalVisible, setIsMenuModalVisible] = useState(false);
    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
    const [isMenuVisible, setIsMenuVisible] = useState(false);

    const fetchDetails = async () => {
        setIsLoading(true);
        try {
            const updatedDetails = await fetchPurchaseOrderDetails(purchaseOrderId);
            if (updatedDetails && updatedDetails[0]) {
                setDetails(updatedDetails[0]);
                setPurchaseOrderLines(updatedDetails[0]?.products_lines || []);
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
            if (purchaseOrderId) {
                fetchDetails(purchaseOrderId);
            }
        }, [purchaseOrderId])
    );

    const handleVendorBill = async () => {
        setIsSubmitting(true);
        try {
            const response = await post('/createPriceEnquiryPurchaseOrder', { _id: details._id });
            if (response.success) {
                showToastMessage('Purchase Order Created Successfully');
                navigation.navigate('OptionScreen');
            } else {
                showToastMessage('Failed to Create Purchase Order. Please try again.');
            }
        } catch (error) {
            showToastMessage('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
            fetchDetails();
        }
    };

    const handleDeletePrice = async () => {
        setIsSubmitting(true);
        try {
            const response = await deleteRequest(`//${details._id}`);
            if (response.success) {
                showToastMessage('Price Enquiry Deleted Successfully');
                navigation.navigate('PriceEnquiryScreen');
            } else {
                showToastMessage('Failed to Delete Price Enquiry. Please try again.');
            }
        } catch (error) {
            showToastMessage('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
            fetchDetails();
        }
    };

    const handleEditPrice = () => {
        navigation.navigate('EditPriceEnquiryDetails', { id: purchaseOrderId });
    };

    const handleDeliveryNote = () => {
        navigation.navigate('DeliveryNoteScreen', { id: purchaseOrderId });
    };

    const handleCancelPurchaseOrder = async () => {
        setIsSubmitting(true);
        try {
            const response = await updatePurchaseOrder(details._id, {
                _id: details._id,
                status: "Cancelled",
                payment_status: "Cancelled",
            });
            console.log("handleCancelPurchaseOrder : ",response)
            if (response.success || response === success) {
                showToastMessage('Purchase Order Cancelled Successfully');
                fetchDetails();
            } else {
                showToastMessage('Failed to Cancel Purchase Order. Please try again.');
            }
        } catch (error) {
            showToastMessage('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView>
            <NavigationHeader
                title={details?.sequence_no || 'Purchase Order Details'}
                onBackPress={() => navigation.goBack()}
                logo={false}
                iconOneName='edit'
                iconOnePress={() => setIsMenuModalVisible(true)}
            />
            <RoundedScrollContainer>
                <DetailField label="Sequence No" value={details?.sequence_no || '-'} />
                <DetailField label="Supplier Name" value={details?.supplier?.supplier_name || '-'} />
                <DetailField label="Ordered Date" value={formatDate(details?.order_date)} />
                <DetailField label="Bill Date" value={formatDate(details?.bill_date)} />
                <DetailField label="Purchase Type" value={details?.purchase_type || '-'} />
                <DetailField label="Company" value={details?.company?.company_name} />
                <DetailField label="Country" value={details?.country?.country_name} />
                <DetailField label="Currency" value={details?.currency?.currency_name} />
                <DetailField label="TRN Number" value={details?.Trn_number} />
                <FlatList
                    data={purchaseOrderLines}
                    renderItem={({ item }) => <PurchaseOrderDetailList item={item} />}
                    keyExtractor={(item) => item._id}
                />

                <View style={{ flexDirection: 'row', marginVertical: 20 }}>
                    <Button
                        width={'30%'}
                        backgroundColor={COLORS.lightRed}
                        title="DELETE"
                        onPress={() => {
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
                    headerMessage="Are you sure you want to delete this?"
                    onConfirm={() => {
                        handleDeletePrice();
                        setIsConfirmationModalVisible(false);
                    }}
                />

                <MenuModal
                    isVisible={isMenuModalVisible}
                    onCancel={() => setIsMenuModalVisible(false)}
                    onOptionSelect={(option) => {
                        if (option === 'Delivery Note') handleDeliveryNote();
                        else if (option === 'PO Cancel') handleCancelPurchaseOrder();
                        // else if (option === 'Send PO') handleSendPO();
                        // else if (option === 'Shipment') handleShipment();
                    }}
                />

                <OverlayLoader visible={isLoading || isSubmitting} />
            </RoundedScrollContainer>
        </SafeAreaView>
    );
};

export default PurchaseOrderDetails;