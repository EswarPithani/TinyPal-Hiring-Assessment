import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { colors } from '../styles/global';

const Chip = ({ label, selected = false, onPress }) => {
    return (
        <TouchableOpacity
            style={{
                backgroundColor: selected ? colors.primary : colors.cardBackground,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 8,
                marginBottom: 8,
                borderWidth: 1,
                borderColor: selected ? colors.primary : colors.border,
            }}
            onPress={onPress}
        >
            <Text style={{
                color: selected ? '#FFFFFF' : colors.textSecondary,
                fontSize: 14,
            }}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

export default Chip;