import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';

const ChipSelector = ({ chips = [], onChipPress }) => {
    if (!chips || chips.length === 0) return null;

    return (
        <View style={{ marginVertical: 12 }}>
            <Text style={[globalStyles.bodyText, { marginBottom: 8 }]}>
                Quick Questions:
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: 'row' }}>
                    {chips.map((chip, index) => (
                        <TouchableOpacity
                            key={index}
                            style={globalStyles.chip}
                            onPress={() => onChipPress && onChipPress(chip)}
                        >
                            <Text style={globalStyles.chipText}>
                                {chip.text || chip.label || chip}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default ChipSelector;