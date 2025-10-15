import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import DidYouKnowCard from '../components/Cards/DidYouKnowCard';
import TinuBottomSheet from '../components/BottomSheet/TinuBottomSheet';
import apiService from '../services/api';

const DidYouKnowScreen = () => {
    const [dykCards, setDykCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tinuVisible, setTinuVisible] = useState(false);
    const [tinuData, setTinuData] = useState({ cards: [], chips: [] });

    useEffect(() => {
        loadDidYouKnowData();
    }, []);

    const loadDidYouKnowData = async () => {
        try {
            setLoading(true);
            const data = await apiService.getPersonalizedAnswers();
            setDykCards(data.dyk_cards || []);
        } catch (error) {
            console.error('Error loading DYK data:', error);
            // Fallback mock data
            setDykCards([
                {
                    fact_text: "Children learn best through play-based activities that engage multiple senses.",
                    supporting_resources: ["Sensory Play Guide", "Age-appropriate Activities"]
                },
                {
                    fact_text: "Reading aloud to children for 15 minutes daily can significantly improve their language skills.",
                    supporting_resources: ["Recommended Book List", "Reading Techniques"]
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleAskTinu = async () => {
        try {
            const data = await apiService.activateTinu('did_you_know');
            setTinuData({
                cards: data.cards || [],
                chips: data.chips || []
            });
            setTinuVisible(true);
        } catch (error) {
            console.error('Error activating Tinu:', error);
            // Fallback mock data
            setTinuData({
                cards: [
                    {
                        title: "Learning Tip",
                        content: "Did you know that consistent routines help children feel secure and learn better?",
                        image_url: null
                    }
                ],
                chips: [
                    { text: "More learning tips" },
                    { text: "Activity suggestions" },
                    { text: "Development milestones" }
                ]
            });
            setTinuVisible(true);
        }
    };

    const handleSendMessage = (message) => {
        console.log('Message sent:', message);
        // Since chat API is not ready, just log the message
        alert(`Message sent: ${message}\n\nNote: Chat API is not implemented yet.`);
    };

    const handleChipPress = (chip) => {
        console.log('Chip pressed:', chip);
        handleSendMessage(chip.text || chip.label || chip);
    };

    if (loading) {
        return (
            <View style={[globalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={[globalStyles.bodyText, { marginTop: 16 }]}>Loading content...</Text>
            </View>
        );
    }

    return (
        <View style={globalStyles.container}>
            <ScrollView style={globalStyles.screenContainer}>
                <Text style={globalStyles.title}>Did You Know?</Text>
                <Text style={[globalStyles.bodyText, { marginBottom: 16 }]}>
                    Discover interesting facts about child development and parenting.
                </Text>

                {dykCards.map((card, index) => (
                    <DidYouKnowCard
                        key={index}
                        card={card}
                        onPress={() => console.log('Card pressed:', card)}
                    />
                ))}

                <TouchableOpacity
                    style={[globalStyles.button, { marginTop: 24 }]}
                    onPress={handleAskTinu}
                >
                    <Text style={globalStyles.buttonText}>Ask Tinu</Text>
                </TouchableOpacity>
            </ScrollView>

            <TinuBottomSheet
                isVisible={tinuVisible}
                onClose={() => setTinuVisible(false)}
                cards={tinuData.cards}
                chips={tinuData.chips}
                onChipPress={handleChipPress}
                onSendMessage={handleSendMessage}
            />
        </View>
    );
};

export default DidYouKnowScreen;