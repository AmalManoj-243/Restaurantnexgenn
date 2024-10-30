import { Keyboard, FlatList } from "react-native";
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

const PurchaseOrderForm = ({ route, navigation }) => {
  const { id } = route.params || {};
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
    countryOfOrigin: [],
    warehouse: [],
  });

  const [formData, setFormData] = useState({
    vendorName: "",
    trnNumber: "",
    currency: "",
    orderDate: new Date(),
    purchaseType: "",
    countryOfOrigin: "",
    billDate: "",
    warehouse: { id: currentUser?.warehouse?.warehouse_id || '', label: currentUser?.warehouse?.warehouse_name },
  });

  useEffect(() => {
    const fetchSuppliers = async () => {
      if (selectedType === "Vendor Name") {
        try {
          const vendorData = await fetchSupplierDropdown(searchText);
          console.log("Fetched Supplier Data:", vendorData);
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
          vendorName: [],
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
    setProductLines((prevLines) => [...prevLines, newProductLine]);
  };

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

  const handleSubmit = async () => {
    const fieldsToValidate = ['vendorName', 'currency', 'country', 'warehouse'];
    if (validateForm(fieldsToValidate)) {
      Keyboard.dismiss();
      setIsSubmitting(true);
      const purchaseOrderData = {
        supplier: "66d320c493ae153e21a522dc",
        currency: "6540b68c05fb79149c3eb7d8",
        purchase_type: "Local Purchase",
        country: "6593b9eef75a5a86947788da",
        bill_date: "2024-10-31",
        company: "66307fc0ceb8eb834bb25507",
        order_date: "2024-10-30",
        Trn_number: 554848484,
        untaxed_total_amount: 10,
        total_amount: 10,
        warehouse_id: "6630800bceb8eb834bb2551d",
        products_lines: [
          {
            product: "6549fbbc170e1456c861c996",
            description: "",
            quantity: 1,
            unit_price: 10,
            sub_total: 10,
            tax_value: 0,
            scheduled_date: "2024-10-30",
            recieved_quantity: 0,
            billed_quantity: 0,
            product_unit_of_measure: "Pcs",
            taxes: "648d9b8fef9cd868dfbfa37f"
          }
        ]
      };

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
          editable={false}
          validate={errors.warehouse}
          value={formData.warehouse?.label}
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
          onPress={() => navigation.navigate('AddPriceLines')}
        />

        <FlatList
          data={productLines}
          renderItem={({ item }) => <ProductLineList item={item} />}
          keyExtractor={(item, index) => index.toString()}
        />
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

export default PurchaseOrderForm;