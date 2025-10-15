import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { globalStyles, colors } from '../styles/global';
import { apiService } from '../services/api';
import Card from '../components/Card';
import TinuBottomSheet from '../components/BottomSheet';


const DidYouKnowScreen = () => {
    const [dykCards, setDykCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inputText, setInputText] = useState('');
    const [tinuData, setTinuData] = useState({ cards: [], chips: [] });
    const [showBottomSheet, setShowBottomSheet] = useState(false);

    useEffect(() => {
        loadDidYouKnowData();
    }, []);

    const loadDidYouKnowData = async () => {
        try {
            setLoading(true);
            const data = await apiService.getPersonalizedAnswers();
            setDykCards(data.dyk_cards || []);
        } catch (error) {
            console.error('Error loading Did You Know data:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleAskTinu = async () => {
        try {
            const data = await apiService.activateTinu('dyk');
            setTinuData(data);
            setShowBottomSheet(true);
        } catch (error) {
            console.error('Error activating Tinu:', error);
        }
    };

    const handleChipPress = (chip) => {
        setInputText(chip.label);
    };

    const handleSendMessage = () => {
        console.log('Sending message:', inputText);
        setInputText('');
    };

    const handleCloseBottomSheet = () => {
        setShowBottomSheet(false);
    };

    const renderCard = ({ item }) => (
        <Card item={item} type="dyk" />
    );

    if (loading) {
        return (
            <View style={[globalStyles.screenContainer, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={globalStyles.bodyText}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={globalStyles.container}>
            <FlatList
                data={dykCards}
                renderItem={renderCard}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <Text style={[globalStyles.bodyText, { textAlign: 'center' }]}>
                        No Did You Know cards available
                    </Text>
                }
            />

            {/* Ask Tinu Button */}
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                    backgroundColor: colors.accent,
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                }}
                onPress={handleAskTinu}
            >
                <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 }}>
                    Ask Tinu
                </Text>
            </TouchableOpacity>

            {/* Tinu Bottom Sheet */}
            <TinuBottomSheet
                visible={showBottomSheet}
                cards={tinuData.cards}
                chips={tinuData.chips}
                onChipPress={handleChipPress}
                onSendMessage={handleSendMessage}
                inputText={inputText}
                setInputText={setInputText}
                onClose={handleCloseBottomSheet}
            />
        </View>
    );
};

export default DidYouKnowScreen;