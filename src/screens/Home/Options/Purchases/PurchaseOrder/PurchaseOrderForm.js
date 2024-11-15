import { View, Keyboard, FlatList, StyleSheet, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { RoundedScrollContainer, SafeAreaView } from "@components/containers";
import { NavigationHeader, TitleWithButton } from "@components/Header";
import { fetchSupplierDropdown, fetchCurrencyDropdown, fetchCountryDropdown, fetchWarehouseDropdown } from "@api/dropdowns/dropdownApi";
import { DropdownSheet } from "@components/common/BottomSheets";
import { TextInput as FormInput } from "@components/common/TextInput";
import { LoadingButton } from "@components/common/Button";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { formatDate } from "@utils/common/date";
import { useAuthStore } from "@stores/auth";
import { post } from "@api/services/utils";
import { OverlayLoader } from "@components/Loader";
import ProductLineList from "./ProductLineList";
import { validateFields } from '@utils/validation';
import { showToast } from '@utils/common';
import { purchaseType } from "@constants/dropdownConst";
import { COLORS, FONT_FAMILY } from "@constants/theme";

const PurchaseOrderForm = ({ route, navigation }) => {
  const currentUser = useAuthStore((state) => state.user);
  const [isVisible, setIsVisible] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [productLines, setProductLines] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [dropdown, setDropdown] = useState({
    vendorName: [],
    currency: [],
    purchaseType: [],
    countryOfOrigin: [],
    warehouse: [],
  });

  const [formData, setFormData] = useState({
    vendorName: "",
    trnNumber: "",
    company: "",
    currency: "",
    orderDate: new Date(),
    purchaseType: "",
    countryOfOrigin: "",
    billDate: "",
    warehouse: { id: currentUser?.warehouse?.warehouse_id || '', label: currentUser?.warehouse?.warehouse_name },
    untaxedAmount: "",
    totalAmount: ""
  });

  useEffect(() => {
    const fetchSuppliers = async () => {
      if (selectedType === "Vendor Name") {
        try {
          const vendorData = await fetchSupplierDropdown(searchText);
          setDropdown((prevDropdown) => ({
            ...prevDropdown,
            vendorName: vendorData?.map((data) => ({
              id: data._id,
              label: data.name?.trim(),
            })),
          }));
        } catch (error) {
          console.error("Error fetching Supplier dropdown data:", error);
        }
      }
    };
    fetchSuppliers();
  }, [searchText, selectedType]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [currencyData, countryData, warehouseData] = await Promise.all([
          fetchCurrencyDropdown(),
          fetchCountryDropdown(),
          fetchWarehouseDropdown(),
        ]);
        setDropdown({
          currency: currencyData.map(data => ({
            id: data._id,
            label: data.currency_name,
          })),
          countryOfOrigin: countryData.map(data => ({
            id: data._id,
            label: data.country_name,
          })),
          warehouse: warehouseData.map(data => ({
            id: data._id,
            label: data.warehouse_name,
          })),
        });
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdownData();
  }, []);

  const toggleBottomSheet = (type) => {
    setSelectedType(type);
    setIsVisible(!isVisible);
  };

  const handleAddProductLine = (newProductLine) => {
    const productLineData = {
      product_id: newProductLine.product_id,
      product_name: newProductLine.product_name,
    };
    setProductLines((prevLines) => [...prevLines, productLineData]);
  };

  useEffect(() => {
    if (route.params?.newProductLine) {
      handleAddProductLine(route.params.newProductLine);
    }
  }, [route.params?.newProductLine]);

  const handleFieldChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: null,
      }));
    }
  };

  const validateForm = (fieldsToValidate) => {
    const { isValid, errors } = validateFields(formData, fieldsToValidate);
    setErrors(errors);
    return isValid;
  };

  const renderBottomSheet = () => {
    let items = [];
    let fieldName = "";

    switch (selectedType) {
      case "Vendor Name":
        items = dropdown.vendorName;
        fieldName = "vendorName";
        break;
      case "Currency":
        items = dropdown.currency;
        fieldName = "currency";
        break;
      case "Purchase Type":
        items = dropdown.purchaseType;
        fieldName = "purchaseType";
        break;
      case "Country Of Origin":
        items = dropdown.countryOfOrigin;
        fieldName = "countryOfOrigin";
        break;
      case "Warehouse":
        items = dropdown.warehouse;
        fieldName = "warehouse";
        break;
      default:
        return null;
    }

    return (
      <DropdownSheet
        isVisible={isVisible}
        items={items}
        title={selectedType}
        onClose={() => setIsVisible(false)}
        search={selectedType === "Vendor Name"}
        onSearchText={(value) => setSearchText(value)}
        onValueChange={(value) => {
          setSearchText("");
          handleFieldChange(fieldName, value);
          setIsVisible(false);
        }}
      />
    );
  };

  const handleSubmit = async () => {
    const fieldsToValidate = ['vendorName', 'trnNumber', 'currency', 'countryOfOrigin', 'warehouse'];
    if (validateForm(fieldsToValidate)) {
      Keyboard.dismiss();
      setIsSubmitting(true);
      const purchaseOrderData = {
        supplier: formData?.vendorName?.id ?? null,
        currency: formData?.currency?.id ?? null,
        purchase_type: formData?.purchaseType?.label ?? null,
        country: formData?.countryOfOrigin?.id ?? null,
        bill_date: formData?.billDate ?? null,
        company: formData?.company?.company_id ?? null,
        order_date: formData?.orderDate ?? null,
        Trn_number: formData?.trnNumber || null,
        untaxed_total_amount: formData?.untaxedAmount || null,
        total_amount: formData?.totalAmount || null,
        warehouse_id: formData?.warehouse?.id ?? null,
        products_line: productLines.map((line) => ({
          product: line.product_id || null,
          description: line.description || null,
          quantity: line.quantity || null,
          unit_price: line.sale_price || null,
          sub_total: line.total || 0,
          tax_value: line.tax || 0,
          scheduled_date: formData.orderDate || "",
          recieved_quantity: "",
          billed_quantity: "",
          product_unit_of_measure: "Pcs",
          taxes: ""
        }))
      }
      console.log("🚀 ~ ServiceFormTabs ~ purchaseOrderData:", JSON.stringify(purchaseOrderData, null, 2));

      try {
        const response = await post("/createPurchaseOrder", purchaseOrderData);
        if (response.success) {
          showToast({
            type: "success",
            title: "Success",
            message: response.message || "Purchase Order created successfully",
          });
          navigation.navigate("PurchaseOrderScreen");
        } else {
          showToast({
            type: "error",
            title: "ERROR",
            message: response.message || "Purchase Order Creation failed",
          });
        }
      } catch (error) {
        console.error("Error Creating Purchase Order:", error);
        showToast({
          type: "error",
          title: "ERROR",
          message: "An unexpected error occurred. Please try again later.",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <SafeAreaView>
      <NavigationHeader
        title="Purchase Order Creation"
        onBackPress={() => navigation.goBack()}
        logo={false}
      />
      <RoundedScrollContainer>
        <FormInput
          label="Vendor Name"
          placeholder="Select Vendor Name"
          dropIcon="menu-down"
          editable={false}
          validate={errors.vendorName}
          value={formData.vendorName?.label}
          required
          multiline={true}
          onPress={() => toggleBottomSheet("Vendor Name")}
        />
        <FormInput
          label="TRN Number"
          placeholder="Enter Transaction Number"
          editable
          keyboardType="numeric"
          validate={errors.trnNumber}
          required
          onChangeText={(value) => handleFieldChange('trnNumber', value)}
        />
        <FormInput
          label="Currency"
          placeholder="Select Currency"
          dropIcon="menu-down"
          editable={false}
          validate={errors.currency}
          value={formData.currency?.label}
          required
          onPress={() => toggleBottomSheet("Currency")}
        />
        <FormInput
          label="Purchase Type"
          placeholder="Select Purchase Type"
          dropIcon="menu-down"
          item={purchaseType}
          editable={false}
          validate={errors.purchaseType}
          value={formData.purchaseType?.label}
          required
          onPress={() => toggleBottomSheet("Purchase Type")}
        />
        <FormInput
          label="Country Of Origin"
          placeholder="Select Country"
          dropIcon="menu-down"
          editable={false}
          validate={errors.countryOfOrigin}
          value={formData.countryOfOrigin?.label}
          required
          onPress={() => toggleBottomSheet("Country Of Origin")}
        />
        <FormInput
          label="Order Date"
          editable={false}
          value={formatDate(formData.orderDate)}
        />
        <FormInput
          label="Bill Date"
          dropIcon="calendar"
          placeholder="dd-mm-yyyy"
          editable={false}
          required
          validate={errors.billDate}
          value={formatDate(formData.billDate)}
          onPress={() => setIsDatePickerVisible(true)}
        />
        <FormInput
          label="Warehouse"
          placeholder="Select Warehouse"
          dropIcon="menu-down"
          editable={false}
          validate={errors.warehouse}
          value={formData.warehouse?.label}
          required
          onPress={() => toggleBottomSheet("Warehouse")}
        />
        <TitleWithButton
          label="Add an item"
          onPress={() => navigation.navigate('AddPurchaseLines')}
        />
        <FlatList
          data={productLines}
          renderItem={({ item }) => (
            <ProductLineList item={item} />
          )}
          keyExtractor={(item, index) => index.toString()}
        />

      <View style={styles.total}>
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Untaxed Amount : </Text>
          <Text style={styles.totalValue}>{}</Text>
        </View>
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Taxes : </Text>
          <Text style={styles.totalValue}>{}</Text>
        </View>
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total : </Text>
          <Text style={styles.totalValue}>{}</Text>
        </View>
      </View>  

        {renderBottomSheet()}
        <LoadingButton
          title="SAVE"
          onPress={handleSubmit}
          marginTop={10}
          loading={isSubmitting}
        />
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          minimumDate={new Date()}
          onConfirm={(date) => {
            setIsDatePickerVisible(false);
            handleFieldChange("billDate", date);
          }}
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
  },
  total: {
    marginTop: 10,
  },
  totalSection: {
    flexDirection: 'row',
    marginVertical: 5,
    margin: 10,
    alignSelf: "center",
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.urbanistBold,
  },
  totalValue: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.urbanistBold,
    color: '#666666',
  },
});

export default PurchaseOrderForm;