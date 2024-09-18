import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '@components/Text';
import { COLORS } from '@constants/theme';
import { FONT_FAMILY } from '@constants/theme';

const SignatureField = ({
  label,
  iconName,
  labelColor,
  ...props
}) => {

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    flex: 2 / 3,
    marginVertical: 8,
    fontSize: 16,
    color: COLORS.primaryThemeColor,
    fontFamily: FONT_FAMILY.urbanistSemiBold,
  },
});

export default SignatureField;
