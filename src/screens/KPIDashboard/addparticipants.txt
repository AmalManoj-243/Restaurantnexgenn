import React, { useEffect, useState } from 'react';
import { RoundedScrollContainer, SafeAreaView } from '@components/containers';
import { TextInput as FormInput } from '@components/common/TextInput';
import { fetchAssigneeDropdown } from '@api/dropdowns/dropdownApi';
import { DropdownSheet } from '@components/common/BottomSheets';
import { NavigationHeader } from '@components/Header';
import { Button } from '@components/common/Button';
import { COLORS } from '@constants/theme';
import { Keyboard, Alert } from 'react-native';
import { validateFields } from '@utils/validation';

const AddParticipants = ({ navigation, route }) => {
    const { id, addParticipants } = route?.params || {};
    const [selectedType, setSelectedType] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [noOfEmployees, setNoOfEmployees] = useState(0);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [errors, setErrors] = useState({});
    const [dropdown, setDropdown] = useState({ employee: [] });
    const [formData, setFormData] = useState({
        noOfEmployees: '',
        employees: [],
    });

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const EmployeeData = await fetchAssigneeDropdown();
                setDropdown(prevDropdown => ({
                    ...prevDropdown,
                    employee: EmployeeData.map(data => ({
                        id: data._id,
                        label: data.name,
                    })),
                }));
            } catch (error) {
                console.error('Error fetching Assignee dropdown data:', error);
            }
        };

        fetchDropdownData();
    }, []);

    const toggleBottomSheet = (type) => {
        setSelectedType(isVisible ? null : type);
        setIsVisible(!isVisible);
    };

    const onFieldChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        });

        if (field === 'noOfEmployees') {
            setNoOfEmployees(parseInt(value, 10) || 0);
        }
    };

    const validateForm = (fieldsToValidate) => {
        Keyboard.dismiss();
        const { isValid, errors } = validateFields(formData, fieldsToValidate);
        setErrors(errors);
        return isValid;
    };

    const handleAddParticipants = (addedItems) => {
        const structuredParticipants = addedItems?.employees.map(employee => ({
            participant_id: employee.id,
            participant_name: employee.label,
        }));

        if (structuredParticipants) {
            console.log("Structured Participants:", structuredParticipants);
        } else {
            console.error("No employees found in addedItems.");
        }
    };

    const handleAddItems = async () => {
        const fieldsToValidate = ['noOfEmployees', 'employees'];
        if (validateForm(fieldsToValidate)) {
            const participantData = {
                employees: formData.employees || [],
            };
            // console.log('Added Participants:', participantData);
            handleAddParticipants(participantData);
            navigation.navigate('KPIActionDetails', { id });
        }
    };

    const handleEmployeeSelection = (value) => {
        if (selectedEmployees.length < noOfEmployees) {
            setSelectedEmployees(prevSelected => [...prevSelected, value]);
            setFormData(prevFormData => ({
                ...prevFormData,
                employees: [...prevFormData.employees, value],
            }));
        }
        setIsVisible(false);
    };

    const renderBottomSheet = () => {
        let items = [];
        let fieldName = '';

        switch (selectedType) {
            case 'Employee':
                items = dropdown.employee;
                fieldName = 'employee';
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
                onValueChange={handleEmployeeSelection}
            />
        );
    };

    return (
        <SafeAreaView>
            <NavigationHeader
                title="Add Participants"
                onBackPress={() => navigation.goBack()}
            />
            <RoundedScrollContainer>
                <FormInput
                    label={"Number of Employees"}
                    placeholder={"Enter Number of Employees"}
                    editable={true}
                    keyboardType="numeric"
                    onChangeText={(value) => onFieldChange('noOfEmployees', value)}
                    value={formData.noOfEmployees}
                />
                <FormInput
                    label={"Employee"}
                    placeholder={"Select Employee"}
                    dropIcon={"menu-down"}
                    items={dropdown.employee}
                    editable={false}
                    required
                    validate={errors.employees}
                    value={selectedEmployees.map(emp => emp.label).join(', ')} 
                    onPress={() => toggleBottomSheet('Employee')}
                />
                <Button
                    title={'Add Participants'}
                    width={'50%'}
                    alignSelf={'center'}
                    backgroundColor={COLORS.primaryThemeColor}
                    onPress={handleAddItems}
                />
                {renderBottomSheet()}
            </RoundedScrollContainer>
        </SafeAreaView>
    );
};

export default AddParticipants;