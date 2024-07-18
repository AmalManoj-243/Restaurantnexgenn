import React, { useEffect, useState } from 'react';
import { RoundedScrollContainer } from '@components/containers';
import { TextInput as FormInput } from '@components/common/TextInput';
import { fetchCountryDropdown, fetchStateDropdown } from '@api/dropdowns/dropdownApi';
import { DropdownSheet } from '@components/common/BottomSheets';

const Address = () => {
  const [errors, setErrors] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const [formData, setFormData] = useState({
    address: "",
    country: "",
    state: "",
    area: "",
    poBox: "",
  });

  const [dropdown, setDropdown] = useState({
    country: [],
    state: [],
    area: [],
  });

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const countryData = await fetchCountryDropdown();
        setDropdown(prevDropdown => ({
          ...prevDropdown,
          country: countryData.map(data => ({
            id: data._id,
            label: data.country_name,
          })),
        }));
      } catch (error) {
        console.error('Error fetching country dropdown data:', error);
      }
    };

    fetchDropdownData();
  }, []);

  useEffect(() => {
    if (formData.country) {
      const fetchStateData = async () => {
        try {
          const stateData = await fetchStateDropdown(formData.country.id);
          setDropdown(prevDropdown => ({
            ...prevDropdown,
            state: stateData.map(data => ({
              id: data._id,
              label: data.state_name,
            })),
          }));
        } catch (error) {
          console.error('Error fetching state dropdown data:', error);
        }
      };

      fetchStateData();
    }
  }, [formData.country]);

  const handleFieldChange = (field, value) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [field]: null,
      }));
    }
  };

  const toggleBottomSheet = (type) => {
    setSelectedType(type);
    setIsVisible(!isVisible);
  };

  const renderBottomSheet = () => {
    let items = [];
    let fieldName = '';

    switch (selectedType) {
      case 'Country':
        items = dropdown.country;
        fieldName = 'country';
        break;
      case 'State':
        items = dropdown.state;
        fieldName = 'state';
        break;
      case 'Area':
        items = dropdown.area;
        fieldName = 'area';
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
        onValueChange={(value) => handleFieldChange(fieldName, value)}
      />
    );
  };

  const validate = () => {
    const requiredFields = {
      address: 'Please enter the Address',
      country: 'Please select a country',
      state: 'Please select a state',
      area: 'Please select an area',
      poBox: 'Please enter PO Box',
    };

    const newErrors = Object.keys(requiredFields).reduce((acc, field) => {
      if (!formData[field]) {
        acc[field] = requiredFields[field];
      }
      return acc;
    }, {});

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <RoundedScrollContainer>
      <FormInput
        label="Address:"
        placeholder="Enter Address"
        editable={true}
        validate={errors.address}
        onChangeText={(value) => handleFieldChange('address', value)}
      />
      <FormInput
        label="Country:"
        placeholder="Select Country"
        dropIcon="menu-down"
        editable={false}
        validate={errors.country}
        onPress={() => toggleBottomSheet("Country")}
      />
      <FormInput
        label="State:"
        placeholder="Select State"
        dropIcon="menu-down"
        editable={false}
        validate={errors.state}
        onPress={() => toggleBottomSheet("State")}
      />
      <FormInput
        label="Area:"
        placeholder="Select Area"
        dropIcon="menu-down"
        editable={false}
        validate={errors.area}
        onPress={() => toggleBottomSheet("Area")}
      />
      <FormInput
        label="PO Box:"
        placeholder="Enter PO Box"
        editable={true}
        validate={errors.poBox}
        onChangeText={(value) => handleFieldChange('poBox', value)}
      />
      {renderBottomSheet()}
    </RoundedScrollContainer>
  );
};

export default Address;
