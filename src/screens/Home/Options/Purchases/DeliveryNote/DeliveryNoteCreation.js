import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { RoundedScrollContainer, SafeAreaView } from "@components/containers";
import { NavigationHeader } from "@components/Header";
import { TextInput as FormInput } from "@components/common/TextInput";
import { Button } from "@components/common/Button";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { COLORS, FONT_FAMILY } from "@constants/theme";
import { formatDate } from "@utils/common/date";
import { useAuthStore } from "@stores/auth";
import { get, post } from "@api/services/utils";
import { OverlayLoader } from "@components/Loader";
import { showToast } from '@utils/common';

const DeliveryNoteCreation = ({ route, navigation }) => {
  const { id } = route.params || {};
  const currentUser = useAuthStore((state) => state.user);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    supplierName: "",
    LPO_no: "",
    orderDate: "",
    billDate: "",
    purchaseType: "",
    company: "",
    country: "",
    currency: ""
  });

  useEffect(() => {
    if (id) {
      fetchDeliveryNoteDetails();
    }
  }, [id]);

  const fetchDeliveryNoteDetails = async () => {
    console.log("Delivery Note ID:", id); // Log the ID to confirm it's correct
    setIsLoading(true);
    try {
      const response = await get(`/viewPurchaseOrderDeliveryNote/${id}`);
      console.log("API Response:", response.data); // Log the response to check if data is actually returned
  
      if (response && response.data && response.data.length > 0) {
        setFormData({
          supplierName: response.data[0].supplierName || "",
          LPO_no: response.data[0].LPO_no || "",
          orderDate: formatDate(response.data[0].orderDate) || "",
          billDate: formatDate(response.data[0].billDate) || "",
          purchaseType: response.data[0].purchaseType || "",
          company: response.data[0].company || "",
          country: response.data[0].country || "",
          currency: response.data[0].currency || ""
        });
      } else {
        console.warn("No data found for this delivery note.");
      }
    } catch (error) {
      console.error("Error fetching delivery note details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const deliveryData = {
      ...formData,
      products_lines: [
        // Populate this array based on product line data
      ]
    };

    try {
      const response = await post("/createPurchaseOrderDeliveryNote", deliveryData);
      if (response.success) {
        showToast({
          type: "success",
          title: "Success",
          message: "Delivery Note created successfully",
        });
        navigation.navigate("DeliveryNoteScreen");
      } else {
        showToast({
          type: "error",
          title: "ERROR",
          message: "Delivery Note Creation failed",
        });
      }
    } catch (error) {
      console.error("Error Creating Delivery Note:", error);
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
    <SafeAreaView>
      <NavigationHeader
        title={'Delivery Note Creation'}
        onBackPress={() => navigation.goBack()}
        logo={false}
      />
      <RoundedScrollContainer>
        <FormInput
          label={"Supplier Name"}
          editable={false}
          value={formData.supplierName}
        />
        <FormInput
          label={"LPO No"}
          editable={false}
          value={formData.LPO_no}
        />
        <FormInput
          label={"Ordered Date"}
          editable={false}
          value={formData.orderDate}
        />
        <FormInput
          label={"Bill Date"}
          editable={false}
          value={formData.billDate}
        />
        <FormInput
          label={"Purchase Type"}
          editable={false}
          value={formData.purchaseType}
        />
        <FormInput
          label={"Company"}
          editable={false}
          value={formData.company}
        />
        <FormInput
          label={"Country"}
          editable={false}
          value={formData.country}
        />
        <FormInput
          label={"Currency"}
          editable={false}
          value={formData.currency}
        />

        <Button
          title="Submit"
          onPress={handleSubmit}
          marginTop={10}
          loading={isSubmitting}
        />
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={(date) => { setFormData((prev) => ({ ...prev, requireBy: date })); setIsDatePickerVisible(false) }}
          minimumDate={new Date()}
          onCancel={() => setIsDatePickerVisible(false)}
        />
      </RoundedScrollContainer>
      <OverlayLoader visible={isLoading || isSubmitting} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  label: {
    marginVertical: 5,
    fontSize: 16,
    color: COLORS.primaryThemeColor,
    fontFamily: FONT_FAMILY.urbanistSemiBold,
  }
});

export default DeliveryNoteCreation;