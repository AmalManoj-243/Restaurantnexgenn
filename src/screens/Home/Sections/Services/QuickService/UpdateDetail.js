import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, FlatList, View, Text, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from '@components/containers';
import NavigationHeader from '@components/Header/NavigationHeader';
import { RoundedScrollContainer } from '@components/containers';
import { DetailField } from '@components/common/Detail';
import { OverlayLoader } from '@components/Loader';
import { Button } from '@components/common/Button';
import SparePartsList from './SparePartsList';
import { formatDateTime } from '@utils/common/date';
import { showToastMessage } from '@components/Toast';
import { fetchServiceDetails } from '@api/details/detailApi';
import { COLORS, FONT_FAMILY } from '@constants/theme';
import AntDesign from '@expo/vector-icons/AntDesign';
import { post, put } from '@api/services/utils';
import { useAuthStore } from '@stores/auth';
import { showToast } from '@utils/common';
import { TextInput as FormInput } from '@components/common/TextInput';

const UpdateDetails = ({ route, navigation }) => {
  const { id } = route.params || {};
  const currentUser = useAuthStore((state) => state.user);
  const [details, setDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sparePartsItems, setSparePartsItems] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState({
    serviceCharge: '',
  });

  const addSpareParts = (addedItem) => {
    setSparePartsItems((prevItems) => [...prevItems, addedItem]);
  };

  const calculateTotals = () => {
    let calculatedSubTotal = sparePartsItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
    setSubTotal(calculatedSubTotal);

    let calculatedTotal = calculatedSubTotal + parseFloat(formData.serviceCharge || 0);
    setTotal(calculatedTotal);
  };

  useEffect(() => {
    calculateTotals();
  }, [sparePartsItems, formData.serviceCharge]);

  const fetchDetails = async () => {
    setIsLoading(true);
    try {
      const updatedDetails = await fetchServiceDetails(id);
      setDetails(updatedDetails[0] || {});
    } catch (error) {
      console.error('Error fetching service details:', error);
      showToastMessage('Failed to fetch service details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (id) {
        fetchDetails(id);
      }
    }, [id])
  );

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const requestPayload = {
      _id: id,
      job_stage: 'Waiting for spare',
      create_job_diagnosis: [
        {
          job_registration_id: id,
          done_by_id: currentUser?.related_profile?._id || null,
          untaxed_total_amount: subTotal,
          done_by_name: currentUser?.related_profile?.name || '',
          service_charge: parseInt(formData.serviceCharge, 10) || 0,
          total_amount: total,
          parts: sparePartsItems.map((items) => ({
            product_id: items?.product.id,
            product_name: items?.product.label,
            description: items?.description,
            quantity: items?.quantity,
            uom_id: items?.uom?.id,
            uom: items?.uom.label,
            unit_price: items.unitPrice,
            tax_type_id: items?.tax?.id,
            tax_type_name: items?.tax.label,
          }))
        }
      ]
    };
    try {
      const response = await put("/updateJobRegistration", requestPayload);
      if (response.success === 'true') {
        showToast({
          type: "success",
          title: "Success",
          message: response.message || "Spare Parts Request updated successfully",
        });
        navigation.navigate("QuickServiceScreen");
      } else {
        console.error("Submit Failed:", response.message);
        showToast({
          type: "error",
          title: "ERROR",
          message: response.message || "Spare Parts Request update failed",
        });
      }
    } catch (error) {
      console.error("Error Submitting Spare Parts Request:", error);
      showToast({
        type: "error",
        title: "ERROR",
        message: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationHeader
        title="Update Service Details"
        onBackPress={() => navigation.goBack()}
      />
      <RoundedScrollContainer>
        <DetailField
          label="Customer"
          value={details?.customer_name?.trim() || '-'}
          multiline
          numberOfLines={3}
          textAlignVertical={'top'}
        />
        <DetailField label="Mobile Number" value={details?.customer_mobile || '-'} />
        <DetailField label="Email" value={details?.customer_email || '-'} />
        <DetailField label="Warehouse Name" value={details?.warehouse_name || '-'} />
        <DetailField label="Created On" value={formatDateTime(details.date)} />
        <DetailField label="Created By" value={details?.assignee_name || '-'} />
        <DetailField label="Brand Name" value={details?.brand_name || '-'} />
        <DetailField label="Device Name" value={details?.device_name || '-'} />

        <FormInput
          label="Service Charge"
          placeholder="Enter Service Charge"
          keyboardType="numeric"
          value={formData.serviceCharge}
          onChangeText={(value) => setFormData({ ...formData, serviceCharge: value })}
        />
        <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginVertical: 10 }}>
          <Text style={styles.label}>Add an Item</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('AddSpareParts', { id, addSpareParts })}>
            <AntDesign name="pluscircle" size={26} color={COLORS.orange} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={sparePartsItems}
          renderItem={({ item }) => (
            <SparePartsList item={item} />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Subtotal: </Text>
          <Text style={styles.totalValue}>{subTotal.toFixed(2)}</Text>
        </View>
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Service Charge: </Text>
          <Text style={styles.totalValue}>{formData.serviceCharge}</Text>
        </View>
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total: </Text>
          <Text style={styles.totalValue}>{total.toFixed(2)}</Text>
        </View>
        <Button
          title={'SUBMIT'}
          width={'50%'}
          alignSelf={'center'}
          backgroundColor={COLORS.orange}
          onPress={handleSubmit}
        />
      </RoundedScrollContainer>
      {isLoading && <OverlayLoader />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  label: {
    marginVertical: 5,
    fontSize: 16,
    color: COLORS.primaryThemeColor,
    fontFamily: FONT_FAMILY.urbanistSemiBold,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,  //padding: 10, 
    margin: 10,
  },
  totalLabel: {
    fontSize: 17,
    fontFamily: FONT_FAMILY.urbanistBold,
  },
  totalValue: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.urbanistBold,
    color: '#666666',
  },
});

export default UpdateDetails;