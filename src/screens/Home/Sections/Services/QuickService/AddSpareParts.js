import { View, Text } from 'react-native'
import React, {useEffect, useState} from 'react'
import { SafeAreaView } from '@components/containers'
import { NavigationHeader } from '@components/Header'
import { TextInput as FormInput } from '@components/common/TextInput'
import { fetchProductsDropdown, fetchUnitOfMeasureDropdown } from '@api/dropdowns/dropdownApi'

const AddSpareParts = () => {

    const [dropdown, setDropdown] = useState({ products: [], unitofmeasure: [] });
    const [formData, setFormData] = useState({
        spareName: '',
        description: '',
        quantity: '',
        uom: '',
        unitPrice: '',
        servicecharge: '',
    })

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const ProductsData = await fetchProductsDropdown();
                setDropdown(prevDropdown => ({
                    ...prevDropdown,
                    products: ProductsData.map(data => ({
                        id: data._id,
                        label: data.product_name?.trim(),
                        unit_price: data.sale_price,
                        product_description: data.product_description,
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
                        product_description: data.product_description,
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
    };
    return (
        <SafeAreaView>
            <NavigationHeader
                title="Add Spare Parts"
                onBackPress={() => navigation.goBack()}
            />
            <FormInput
                label="Spare Name"
                placeholder="Select Product Name"
                dropIcon="menu-down"
                multiline
                required
                editable={false}
                items={dropdown.products}
                value={spareName?.label?.trim()}
                onPress={() => toggleBottomSheet('SpareName')}
            />
            <FormInput
                label="Description"
                placeholder="Enter Description"
                editable={true}
                value={description}
                onChangeText={setDescription}
            />
            <FormInput
                label="Quantity"
                placeholder="Enter Quantity"
                editable={true}
                keyboardType="numeric"
                value={quantity}
                onChangeText={handleQuantityChange}
            />
            <FormInput
                label="UOM"
                placeholder="Select Unit Of Measure"
                dropIcon="menu-down"
                editable={false}
                items={dropdown.unitofmeasure}
                value={uom?.label}
                onPress={() => toggleBottomSheet('UOM')}
            />
            <FormInput
                label="Unit Price"
                placeholder="Enter Unit Price"
                editable={false}
                keyboardType="numeric"
                value={unitPrice}
                onChangeText={setUnitPrice}
            />
            <FormInput
                label="Taxes"
                placeholder="Enter Tax"
                editable={true}
                required
                keyboardType="numeric"
                value={tax}
                onChangeText={setTax}
            />
            <FormInput
                label="Service Charge"
                placeholder="Enter Service Charge"
                editable={true}
                keyboardType="numeric"
                value={serviceCharge}
                onChangeText={setServiceCharge}
            />
            <FormInput
                label="Sub Total"
                placeholder="Enter Sub Total"
                editable={false}
                keyboardType="numeric"
                value={subTotal}
                onChangeText={setSubTotal}
            />
        </SafeAreaView>
    )
}

export default AddSpareParts