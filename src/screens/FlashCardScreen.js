import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import FlashCard from '../components/Cards/FlashCard';
import TinuBottomSheet from '../components/BottomSheet/TinuBottomSheet';
import { apiService } from '../services/api';


const FlashCardScreen = () => {
    const [flashCards, setFlashCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tinuVisible, setTinuVisible] = useState(false);
    const [tinuData, setTinuData] = useState({ cards: [], chips: [] });

    useEffect(() => {
        loadFlashCardData();
    }, []);

    const loadFlashCardData = async () => {
        try {
            setLoading(true);
            const data = await apiService.getPersonalizedAnswers();
            console.log('Flash Cards Data:', data);
            setFlashCards(data.flash_cards || []);
        } catch (error) {
            console.error('Error loading flash card data:', error);
            // Fallback mock data
            setFlashCards([
                {
                    question: "What is the recommended screen time for toddlers?",
                    answer: "The American Academy of Pediatrics recommends no screen time for children under 18 months, and only high-quality programming with co-viewing for children 18-24 months."
                },
                {
                    question: "How much sleep does a 3-year-old need?",
                    answer: "Most 3-year-olds need 10-13 hours of sleep per day, including naps."
                },
                {
                    question: "What are the benefits of reading to children?",
                    answer: "Reading aloud builds vocabulary, improves listening skills, enhances imagination, and strengthens parent-child bonding."
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleAskTinu = async () => {
        try {
            const data = await apiService.activateTinu('flash_card');
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
                        title: "Flash Card Tip",
                        content: "Try reviewing flash cards in short, frequent sessions for better retention. Space out repetition over time.",
                        image_url: null
                    }
                ],
                chips: [
                    { text: "Create new flash card" },
                    { text: "Quiz me on this topic" },
                    { text: "Explain this concept" },
                    { text: "More learning strategies" }
                ]
            });
            setTinuVisible(true);
        }
    };

    const handleSendMessage = (message) => {
        console.log('Message sent to Tinu:', message);
        Alert.alert('Message Sent', `"${message}"\n\nNote: Chat API is not implemented yet. This is a demo.`);
    };

    const handleChipPress = (chip) => {
        handleSendMessage(chip.text || chip.label || chip);
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading flash cards...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer}>
                <Text style={styles.title}>Flash Cards</Text>
                <Text style={styles.subtitle}>
                    Tap on cards to flip and learn more about parenting and child development.
                </Text>

                {flashCards.map((card, index) => (
                    <FlashCard key={index} card={card} />
                ))}

                <TouchableOpacity style={styles.tinuButton} onPress={handleAskTinu}>
                    <Text style={styles.tinuButtonText}>Ask Tinu 🤖</Text>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContainer: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    tinuButton: {
        backgroundColor: '#5856D6',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    tinuButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loadingText: {
        fontSize: 16,
        color: '#666666',
        marginTop: 16,
    },
});

export default FlashCardScreen;