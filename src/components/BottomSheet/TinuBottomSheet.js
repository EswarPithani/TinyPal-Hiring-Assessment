import React, { useRef, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { globalStyles } from '../../styles/globalStyles';
import TinuCard from '../Cards/TinuCard';
import ChatInput from '../Chat/ChatInput';
import ChipSelector from '../Chat/ChipSelector';

const TinuBottomSheet = ({
    isVisible,
    onClose,
    cards = [],
    chips = [],
    onChipPress,
    onSendMessage
}) => {
    const bottomSheetRef = useRef(null);

    const snapPoints = useMemo(() => ['60%', '85%'], []);

    const handleSheetChanges = useCallback((index) => {
        if (index === -1) {
            onClose();
        }
    }, [onClose]);

    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
            />
        ),
        []
    );

    if (!isVisible) return null;

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            backdropComponent={renderBackdrop}
            enablePanDownToClose={true}
        >
            <BottomSheetView style={{ flex: 1, padding: 16 }}>
                <Text style={[globalStyles.subtitle, { marginBottom: 16 }]}>
                    Ask Tinu Anything
                </Text>

                {/* Tinu Cards */}
                <View style={{ flex: 1 }}>
                    {cards.map((card, index) => (
                        <TinuCard key={index} card={card} />
                    ))}
                </View>

                {/* Chips */}
                <ChipSelector chips={chips} onChipPress={onChipPress} />

                {/* Chat Input */}
                <ChatInput onSendMessage={onSendMessage} />
            </BottomSheetView>
        </BottomSheet>
    );
};

export default TinuBottomSheet;