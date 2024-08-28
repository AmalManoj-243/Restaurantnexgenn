import { View, Text } from 'react-native'
import React, {useEffect, useState} from 'react'
import { RoundedScrollContainer, SafeAreaView } from '@components/containers'
import { NavigationHeader } from '@components/Header'
import { TextInput as FormInput } from '@components/common/TextInput'
import { fetchProductsDropdown, fetchUnitOfMeasureDropdown } from '@api/dropdowns/dropdownApi'
import { Button } from '@components/common/Button'
import { COLORS } from '@constants/theme'
import { DropdownSheet } from '@components/common/BottomSheets'

const AddSpareParts = ({navigation}) => {

    const [dropdown, setDropdown] = useState({ products: [], unitofmeasure: [] });
    const [formData, setFormData] = useState({
        spareParts: '',
        description: '',
        quantity: '',
        uom: '',
        unitPrice: '',
        servicecharge: '',
    })
    const [selectedType, setSelectedType] = useState(null);
    const [isVisible, setIsVisible] = useState(false);


    const toggleBottomSheet = (type) => {
        setSelectedType(type);
        setIsVisible(!isVisible);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const ProductsData = await fetchProductsDropdown();
                setDropdown(prevDropdown => ({
                    ...prevDropdown,
                    products: ProductsData.map(data => ({
                        id: data._id,
                        label: data.product_name?.trim(),
                        unitPrice: data.sale_price,
                        productDescription: data.product_description,
                    })),
                }));
            } catch (error) {
                console.error('Error fetching Products dropdown data:', error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchUnitOfMeasure = async () => {
            try {
                const UnitOfMeasureData = await fetchUnitOfMeasureDropdown();
                setDropdown(prevDropdown => ({
                    ...prevDropdown,
                    unitofmeasure: UnitOfMeasureData.map(data => ({
                        id: data._id,
                        label: data.uom_name,
                    })),
                }));
            } catch (error) {
                console.error('Error fetching Unit Of Measure dropdown data:', error);
            }
        };

        fetchUnitOfMeasure();
    }, []);


    const renderBottomSheet = () => {
        let items = [];
        let fieldName = '';

        switch (selectedType) {
            case 'SpareName':
                items = dropdown.products;
                fieldName = 'spareName';
                break;
            case 'UOM':
                items = dropdown.unitofmeasure;
                fieldName = 'uom';
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
                onValueChange={(value) => {
                    if (fieldName === 'spareName') handleProductSelection(value);
                    else if (fieldName === 'uom') setUom(value);
                }}
            />
        );
    };
    return (
        <SafeAreaView>
            <NavigationHeader
                title="Add Spare Parts"
                onBackPress={() => navigation.goBack()}
            />
            <RoundedScrollContainer>
            <FormInput
                label="Spare Name"
                placeholder="Select Product Name"
                dropIcon="menu-down"
                multiline
                required
                editable={false}
                value={formData.spareParts?.label?.trim()}
                onPress={() => toggleBottomSheet('SpareName')}
            />
            <FormInput
                label="Description"
                placeholder="Enter Description"
                editable={true}
                // value={description}
                // onChangeText={setDescription}
            />
            <FormInput
                label="Quantity"
                placeholder="Enter Quantity"
                editable={true}
                keyboardType="numeric"
                // value={quantity}
                // onChangeText={handleQuantityChange}
            />
            <FormInput
                label="UOM"
                placeholder="Select Unit Of Measure"
                dropIcon="menu-down"
                editable={false}
                // items={dropdown.unitofmeasure}
                // value={uom?.label}
                onPress={() => toggleBottomSheet('UOM')}
            />
            <FormInput
                label="Unit Price"
                placeholder="Enter Unit Price"
                editable={false}
                keyboardType="numeric"
                // value={unitPrice}
                // onChangeText={setUnitPrice}
            />
            <FormInput
                label="Taxes"
                placeholder="Enter Tax"
                editable={true}
                required
                keyboardType="numeric"
                // value={tax}
                // onChangeText={setTax}
            />
            <FormInput
                label="Sub Total"
                placeholder="Enter Sub Total"
                editable={false}
                keyboardType="numeric"
                // value={subTotal}
                // onChangeText={setSubTotal}
            />
            {renderBottomSheet()}
            <Button title={'SAVE'} width={'50%'} alignSelf={'center'} backgroundColor={COLORS.primaryThemeColor} />
            </RoundedScrollContainer>
        </SafeAreaView>
    )
}

export default AddSpareParts