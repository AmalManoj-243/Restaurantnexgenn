import React, { useEffect, useState } from "react";
import { RoundedScrollContainer, SafeAreaView } from "@components/containers";
import { NavigationHeader } from "@components/Header";
import { TextInput as FormInput } from "@components/common/TextInput";
import { Button } from "@components/common/Button";
import {
  DropdownSheet,
  MultiSelectDropdownSheet,
} from "@components/common/BottomSheets";
import { COLORS } from "@constants/theme";
import {
  fetchProductsDropdown,
  fetchSupplierDropDown,
} from "@api/dropdowns/dropdownApi";

const AddProductLines = ({ navigation, route }) => {
  const [dropdown, setDropdown] = useState({
    products: [],
  });
  const [searchText, setSearchText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    suppliers: [],
    quantity: "",
    remarks: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await fetchProductsDropdown(searchText);
        setDropdown((prevDropdown) => ({
          ...prevDropdown,
          products: productsData?.map((data) => ({
            id: data._id,
            label: data.product_name?.trim(),
          })),
        }));
      } catch (error) {
        console.error("Error fetching Products dropdown data:", error);
      }
    };
    if(selectedType  === "Product"){
    fetchProducts();
    }
  }, [searchText,selectedType]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const supplierData = await fetchSupplierDropDown(searchText);
        setDropdown((prevDropdown) => ({
          ...prevDropdown,
          suppliers: supplierData?.map((data) => ({
            id: data._id,
            label: data.name?.trim(),
          })),
        }));
      } catch (error) {
        console.error("Error fetching Supplier dropdown data:", error);
      }
    };
    if (selectedType === "Supplier") {
      fetchSuppliers();
    }
  },[searchText,selectedType]);

  const toggleBottomSheet = (type) => {
    setSelectedType(type);
    setIsVisible((prev) => !prev);
  };
  useEffect(() => {
    console.log("Bottom sheet visibility:", isVisible);
  }, [isVisible]); 

  const handleProductSelection = (selectedProduct) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      productId: selectedProduct.id,
      productName: selectedProduct.label,
    }));
  };

  const handleSupplierSelection = (selectedSupplier) => {
    const selectedSuppliersData = selectedSupplier.map((supplier) => ({
      id: supplier.id,
      name: supplier.label
    }));
    setFormData((prevFormData) => ({
      ...prevFormData,
      suppliers: selectedSuppliersData, // Update suppliers in formData
    }));
  }

  const renderBottomSheet = () => {
    let items = [];
    let isMultiSelect = true;
    let fieldName = "";

    switch (selectedType) {
      case "Product":
        items = dropdown.products;
        fieldName = "products";
        isMultiSelect = false;
        break;
      case "Supplier":
        items = dropdown.suppliers;
        isMultiSelect = true;
        fieldName = "suppliers";
      default:
        return null;
    }

    return isMultiSelect ? (
      <MultiSelectDropdownSheet
        isVisible={isVisible}
        items={items}
        title={selectedType}
        search
        onSearchText={(value) => setSearchText(value)}
        onValueChange={(selectedValues) => {
          handleSupplierSelection(selectedValues);
          setIsVisible(false);
        }}
        onClose={() => setIsVisible(false)}
      />
    ) : (
      <DropdownSheet
        isVisible={isVisible}
        items={items}
        title={selectedType}
        onClose={() => setIsVisible(false)}
        search
        onSearchText={(value) => setSearchText(value)}
        onValueChange={(value) => {
          setSearchText("");
          if (selectedType === "Product") {
            handleProductSelection(value);
          }
        }}
      />
    );
  };

  return (
    <SafeAreaView>
      <NavigationHeader
        title={"Add ProductLine"}
        onBackPress={() => navigation.goBack()}
      />
      <RoundedScrollContainer>
        <FormInput
          label={"Product"}
          placeholder={"Select Product"}
          dropIcon={"menu-down"}
          editable={false}
          required
          value={formData.productName}
          onPress={() => toggleBottomSheet("Product")}
        />
        <FormInput
          label={"Quantity"}
          placeholder={"Enter quantity"}
          required
          editable={true}
        />
        <FormInput
          label={"Remarks"}
          placeholder={"Enter remarks"}
          required
          editable={true}
        />
        <FormInput
          label={"Supplier"}
          placeholder={"Add Suppliers"}
          dropIcon={"menu-down"}
          editable={false}
          required
          value={formData.suppliers.map((supplier) => supplier.name).join(", ")}
          onPress={() => toggleBottomSheet("Supplier")}
        />
        <Button
          title={"Add Product"}
          width={"50%"}
          alignSelf={"center"}
          backgroundColor={COLORS.primaryThemeColor}
          // onPress={handleAddItems}
        />
        {renderBottomSheet()}
      </RoundedScrollContainer>
    </SafeAreaView>
  );
};

export default AddProductLines;
